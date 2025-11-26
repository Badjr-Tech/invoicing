"use server";

import { getSession } from "@/app/login/actions";
import * as nodemailer from "nodemailer";

type FormState = {
  message: string;
  error: string;
} | undefined;

export async function sendContract(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to send a contract." };
  }

  const clientEmail = formData.get("clientEmail") as string;
  const message = formData.get("message") as string;
  const contract = formData.get("contract") as File;

  if (!clientEmail || !message || !contract) {
    return { message: "", error: "Client, message, and contract are required." };
  }

  try {
    // Create a test account on Ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@example.com>', // sender address
      to: clientEmail, // list of receivers
      subject: "Contract for your review", // Subject line
      text: message, // plain text body
      attachments: [
        {
          filename: contract.name,
          content: Buffer.from(await contract.arrayBuffer()),
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return { message: `Contract sent successfully! Preview URL: ${nodemailer.getTestMessageUrl(info)}`, error: "" };
  } catch (error: unknown) {
    console.error("Error sending contract:", error);
    let errorMessage = "Failed to send contract.";
    if (error instanceof Error) {
      errorMessage = `Failed to send contract: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
