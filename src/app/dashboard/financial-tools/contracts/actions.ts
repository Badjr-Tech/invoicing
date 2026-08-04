"use server";

import { getSession } from "@/app/login/actions";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { renderBrandedEmail, renderPlainText } from "@/lib/email-template";
import { MAX_UPLOAD_BYTES } from "@/lib/uploads";

type FormState = {
  message: string;
  error: string;
} | undefined;

/** Brevo caps a message near 10 MB and base64 adds about a third. */
const MAX_ATTACHMENT_BYTES = Math.floor(MAX_UPLOAD_BYTES * 0.7);

export async function sendContract(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session?.user) {
    return { message: "", error: "You must be logged in to send a contract." };
  }

  const clientEmail = formData.get("clientEmail") as string;
  const message = formData.get("message") as string;
  const contract = formData.get("contract") as File;

  if (!clientEmail || !message || !contract) {
    return { message: "", error: "Client, message, and contract are required." };
  }

  if (contract.size > MAX_ATTACHMENT_BYTES) {
    return {
      message: "",
      error: `That file is too large to email. Keep it under ${Math.floor(MAX_ATTACHMENT_BYTES / 1024 / 1024)} MB.`,
    };
  }

  try {
    // The client should see the member's business, not AGENCY.
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.userId, session.user.id),
    });

    const brand = {
      name: business?.businessName ?? session.user.name ?? "AGENCY",
      color1: business?.color1,
      color2: business?.color2,
      logoUrl: business?.logoUrl,
    };

    const content = {
      brand,
      heading: "A contract for your review",
      paragraphs: [message],
      footerNote: `Sent by ${session.user.name}. Reply to this email with any questions.`,
      preheader: `${brand.name} sent you a contract to review.`,
    };

    const result = await sendEmail({
      to: clientEmail,
      subject: `Contract for your review — ${brand.name}`,
      text: renderPlainText(content),
      html: renderBrandedEmail(content),
      fromName: brand.name,
      replyTo: { email: session.user.email, name: session.user.name },
      attachments: [
        {
          name: contract.name,
          contentBase64: Buffer.from(await contract.arrayBuffer()).toString("base64"),
        },
      ],
    });

    if (!result.ok) {
      // Previously this sent to a fake Ethereal inbox and reported success, so
      // a failure to configure mail must now surface rather than look sent.
      console.error(`[send-contract] ${result.error}`);
      return {
        message: "",
        error: result.skipped
          ? "Email is not configured yet, so the contract was not sent."
          : "The contract could not be sent. Please try again.",
      };
    }

    return { message: `Contract sent to ${clientEmail}.`, error: "" };
  } catch (error: unknown) {
    console.error("Error sending contract:", error);
    return { message: "", error: "Failed to send contract." };
  }
}
