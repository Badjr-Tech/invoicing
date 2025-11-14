'use server';

import { db } from "@/db";
import { demographics, demographicCategoryEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
      console.log(`Attempting to insert Religion: ${religion}`);
      const existing = await db.query.demographics.findFirst({
        where: and(eq(demographics.name, religion), eq(demographics.category, 'Religion')),
      });
      if (!existing) {
        await db.insert(demographics).values({ name: religion, category: 'Religion' });
        console.log(`Successfully inserted Religion: ${religion}`);
      } else {
        console.log(`Religion already exists, skipping: ${religion}`);
      }
    }
    console.log("Religions population complete.");

    // Insert Races
    for (const race of races) {
      console.log(`Attempting to insert Race: ${race}`);
      const existing = await db.query.demographics.findFirst({
        where: and(eq(demographics.name, race), eq(demographics.category, 'Race')),
      });
      if (!existing) {
        await db.insert(demographics).values({ name: race, category: 'Race' });
        console.log(`Successfully inserted Race: ${race}`);
      } else {
        console.log(`Race already exists, skipping: ${race}`);
      }
    }
    console.log("Races population complete.");

    // Insert Genders
    for (const gender of genders) {
      console.log(`Attempting to insert Gender: ${gender}`);
      const existing = await db.query.demographics.findFirst({
        where: and(eq(demographics.name, gender), eq(demographics.category, 'Gender')),
      });
      if (!existing) {
        await db.insert(demographics).values({ name: gender, category: 'Gender' });
        console.log(`Successfully inserted Gender: ${gender}`);
      } else {
        console.log(`Gender already exists, skipping: ${gender}`);
      }
    }
    console.log("Genders population complete.");

    return { success: true, message: "Demographics populated successfully!" };
  } catch (error) {
    console.error("Error populating demographics:", error);
    return { success: false, message: "Failed to populate demographics." };
  }
}
