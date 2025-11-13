"use server";

import { db } from "@/db";
import { users, businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Define the structure of the user object within the session
interface UserSession {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'internal' | 'external'; // Assuming userRole enum from schema
  hasBusinessProfile: boolean;
  personalAddress: string | null;
  personalCity: string | null;
  personalState: string | null;
  personalZipCode: string | null;
  profilePhotoUrl: string | null;
  isOptedOut: boolean;
}

// Extend JWTPayload to include our user session data
export interface SessionPayload extends JWTPayload {
  user?: UserSession;
  expires?: Date;
}

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not set.");
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as SessionPayload;
}

export type FormState = {
  error: string;
} | undefined;

export async function login(prevState: FormState, formData: FormData) {
  console.log("Login function started.");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Attempting to find user in DB with email:", email);
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  console.log("User found:", !!user);

  if (!user) {
    console.log("User not found or invalid credentials.");
    return { error: "Invalid email or password" };
  }

  console.log("Comparing password for user:", user.id);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("Invalid password.");
    return { error: "Invalid email or password" };
  }

  try {
    console.log("Creating session for user:", user.id);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const cookieStore = await cookies();
    console.log("Encrypting session payload.");
    const encryptedSession = await encrypt({ user, expires });
    cookieStore.set("session", encryptedSession, { expires, httpOnly: true });
    console.log("Session cookie set.");

    console.log("Checking for user businesses.");
    const userBusinesses = await db.query.businesses.findFirst({
      where: eq(businesses.userId, user.id),
    });
    console.log("User businesses found:", !!userBusinesses);

    if (!userBusinesses) {
      console.log("Redirecting to dashboard (no businesses).");
      redirect("/dashboard"); // Redirect to dashboard (home page) if no businesses exist
    } else {
      console.log("Redirecting to dashboard (businesses exist).");
      redirect("/dashboard"); // Redirect to dashboard if businesses exist
    }
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors to allow Next.js to handle the redirect
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Login error caught in catch block:", error); // Log other errors for server-side debugging
    let errorMessage = "An unexpected error occurred during login.";
    if (error instanceof Error) {
      errorMessage = `Login failed: ${error.message}`;
    }
    return { error: errorMessage };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
  redirect("/login");
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// New server action to fetch session for client components
export async function fetchSession(): Promise<SessionPayload | null> {
  return await getSession();
}
