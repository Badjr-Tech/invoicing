"use server";

import { db } from "@/db";
import { userProducts } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

type FormState = {
  message: string;
  error: string;
} | undefined;

export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const productId = formData.get("productId") as string;

  if (!productId) {
    return { message: "", error: "Product ID is required." };
  }

  try {
    await db.insert(userProducts).values({
      userId,
      productId,
    });

    revalidatePath("/dashboard"); // Revalidate the dashboard layout to update the sidebar

    return { message: "Product added successfully!", error: "" };
  } catch (error) {
    console.error("Error adding product:", error);
    let errorMessage = "Failed to add product.";
    if (error instanceof Error) {
      errorMessage = `Failed to add product: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getUserProducts(userId: number) {
  try {
    const products = await db.query.userProducts.findMany({
      where: (userProducts, { eq }) => eq(userProducts.userId, userId),
    });
    return products;
  } catch (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
}
