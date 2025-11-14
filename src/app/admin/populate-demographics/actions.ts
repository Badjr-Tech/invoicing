"use server";

import { db } from "@/db";
import { demographics, demographicCategoryEnum } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function populateDemographics() {
  try {
    const existingDemographics = await db.query.demographics.findMany();
    if (existingDemographics.length > 0) {
      return { message: "Demographics already populated.", error: "" };
    }

    const dataToInsert = [
      // Genders
      { name: "Male", category: "Gender" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Female", category: "Gender" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Non-binary", category: "Gender" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Prefer not to say", category: "Gender" as typeof demographicCategoryEnum.enumValues[number] },

      // Races
      { name: "White", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Black or African American", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Asian", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "American Indian or Alaska Native", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Native Hawaiian or Other Pacific Islander", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Hispanic or Latino", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Two or More Races", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Prefer not to say", category: "Race" as typeof demographicCategoryEnum.enumValues[number] },

      // Religions
      { name: "Christianity", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Islam", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Hinduism", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Buddhism", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Sikhism", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Judaism", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Other", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "None", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
      { name: "Prefer not to say", category: "Religion" as typeof demographicCategoryEnum.enumValues[number] },
    ];

    await db.insert(demographics).values(dataToInsert);

    revalidatePath("/admin/populate-demographics");
    return { message: "Demographics populated successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error populating demographics:", error);
    let errorMessage = "Failed to populate demographics.";
    if (error instanceof Error) {
      errorMessage = `Failed to populate demographics: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
