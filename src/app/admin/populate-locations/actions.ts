"use server";

import { db } from "@/db";
import { locations, locationCategoryEnum } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function populateLocations() {
  try {
    const existingLocations = await db.query.locations.findMany();
    if (existingLocations.length > 0) {
      return { message: "Locations already populated.", error: "" };
    }

    const dataToInsert = [
      // Cities (examples)
      { name: "New York", category: "City" as typeof locationCategoryEnum.enumValues[number] },
      { name: "Los Angeles", category: "City" as typeof locationCategoryEnum.enumValues[number] },
      { name: "Chicago", category: "City" as typeof locationCategoryEnum.enumValues[number] },
      { name: "Houston", category: "City" as typeof locationCategoryEnum.enumValues[number] },
      { name: "Phoenix", category: "City" as typeof locationCategoryEnum.enumValues[number] },

      // Regions (examples)
      { name: "Northeast", category: "Region" as typeof locationCategoryEnum.enumValues[number] },
      { name: "Midwest", category: "Region" as typeof locationCategoryEnum.enumValues[number] },
      { name: "South", category: "Region" as typeof locationCategoryEnum.enumValues[number] },
      { name: "West", category: "Region" as typeof locationCategoryEnum.enumValues[number] },
    ];

    await db.insert(locations).values(dataToInsert);

    revalidatePath("/admin/populate-locations");
    return { message: "Locations populated successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error populating locations:", error);
    let errorMessage = "Failed to populate locations.";
    if (error instanceof Error) {
      errorMessage = `Failed to populate locations: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
