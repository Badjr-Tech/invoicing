"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/login/actions";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  encrypt,
  sessionCookieOptions,
  toSessionUser,
} from "@/lib/session-core";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";

type FormState = {
  message: string;
  error: string;
} | undefined;

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    return { message: "", error: "User not authenticated." };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const personalAddress = formData.get("personalAddress") as string;
  const personalCity = formData.get("personalCity") as string;
  const personalState = formData.get("personalState") as string;
  const personalZipCode = formData.get("personalZipCode") as string;
  const profilePhoto = formData.get("profilePhoto") as File; // New field (File)

  if (!name || !phone) {
    return { message: "", error: "Name and Phone are required." };
  }

  try {
    let profilePhotoUrl: string | undefined;
    if (profilePhoto && profilePhoto.size > 0) {
      const blob = await put(profilePhoto.name, profilePhoto, { access: 'public', allowOverwrite: true });
      profilePhotoUrl = blob.url;
    }

    await db.update(users)
      .set({
        name,
        phone,
        personalAddress,
        personalCity,
        personalState,
        personalZipCode,
        profilePhotoUrl: profilePhotoUrl || undefined,
      })
      .where(eq(users.id, session.user.id));

    // Fetch the updated user from the database
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (updatedUser) {
      // Re-issue the session so the sidebar and profile reflect the new values.
      // toSessionUser keeps the password hash out of the token.
      const expires = new Date(Date.now() + SESSION_DURATION_MS);
      const token = await encrypt({ user: toSessionUser(updatedUser) }, expires);
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
    }

    revalidatePath("/dashboard/profile"); // Revalidate the specific profile path to show updated data
    return { message: "Profile updated successfully!", error: "" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { message: "", error: "Failed to update profile." };
  }
}
