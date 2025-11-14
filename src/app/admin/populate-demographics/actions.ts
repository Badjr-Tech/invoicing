'use server';

import { db } from "@/db";
import { demographics, demographicCategoryEnum } from "@/db/schema";

export async function populateDemographics() {
  const religions = [
    "Christianity", "Islam", "Judaism", "Hinduism", "Buddhism", "Sikhism",
    "Baháʼí Faith", "Shinto", "Taoism", "Confucianism", "Jainism",
    "Indigenous / Traditional Beliefs", "Pagan / Wicca", "Atheist", "Agnostic",
    "Spiritual but Not Religious", "Other"
  ];

  const races = [
    "White", "Black or African American", "Asian", "American Indian or Alaska Native",
    "Native Hawaiian or Other Pacific Islander", "Middle Eastern or North African",
    "Two or More Races", "Other"
  ];

  const genders = [
    "Male", "Female", "Non-Binary", "Other"
  ];

  try {
    // Insert Religions
    for (const religion of religions) {
      await db.insert(demographics).values({ name: religion, category: 'Religion' });
    }
    console.log("Religions populated successfully.");

    // Insert Races
    for (const race of races) {
      await db.insert(demographics).values({ name: race, category: 'Race' });
    }
    console.log("Races populated successfully.");

    // Insert Genders
    for (const gender of genders) {
      await db.insert(demographics).values({ name: gender, category: 'Gender' });
    }
    console.log("Genders populated successfully.");

    return { success: true, message: "Demographics populated successfully!" };
  } catch (error) {
    console.error("Error populating demographics:", error);
    return { success: false, message: "Failed to populate demographics." };
  }
}
