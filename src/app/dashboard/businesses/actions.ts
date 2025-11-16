'use server';

import { db } from "@/db";
import { businesses, businessTypeEnum, businessTaxStatusEnum, Business, DemographicType, LocationType } from "@/db/schema"; // Updated import
import { eq, like, and, InferSelectModel } from "drizzle-orm";
import { getSession, SessionPayload } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { InferInsertModel } from "drizzle-orm"; // Import InferInsertModel

type FormState = {
  message: string;
  error: string;
} | undefined;

type NewBusiness = InferInsertModel<typeof businesses>; // Define type for new business

// Helper function to get user ID from session
async function getUserIdFromSession(): Promise<number | undefined> {
  const session: SessionPayload | null = await getSession();
  return session?.user?.id;
}

export async function fetchSession(): Promise<SessionPayload | null> {
  return await getSession();
}

export async function getBusinessProfile(businessId: number): Promise<Business & { ownerGender?: DemographicType | null; ownerRace?: DemographicType | null; ownerReligion?: DemographicType | null; ownerRegion?: LocationType | null; } & { color1?: string | null; color2?: string | null; color3?: string | null; color4?: string | null; } | null> {
  try {
    const profile = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId),
    });
    if (!profile) { return null; }
    return profile;
  } catch (error) {
    console.error("Error fetching business profile:", error);
    return null;
  }
}

export async function getAllUserBusinesses(userId: number, searchQuery?: string, filters?: { businessType?: string; businessTaxStatus?: string; isArchived?: boolean; }) {
  try {
    const conditions = [eq(businesses.userId, userId)];

    if (searchQuery) {
      conditions.push(like(businesses.businessName, `%${searchQuery}%`));
    }

    if (filters?.businessType) {
      conditions.push(eq(businesses.businessType, filters.businessType as typeof businessTypeEnum.enumValues[number]));
    }

    if (filters?.businessTaxStatus) {
      conditions.push(eq(businesses.businessTaxStatus, filters.businessTaxStatus as typeof businessTaxStatusEnum.enumValues[number]));
    }

    if (filters?.isArchived !== undefined) {
      conditions.push(eq(businesses.isArchived, filters.isArchived));
    }

    const allBusinesses = await db.query.businesses.findMany({
      where: and(...conditions),
      orderBy: (businesses, { asc, desc }) => [asc(businesses.isArchived), asc(businesses.businessName)],
    });
    return allBusinesses;
  } catch (error) {
    console.error("Error fetching all user businesses:", error);
    return [];
  }
}

export async function getAllBusinesses() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allBusinesses = await db.query.businesses.findMany();
    return allBusinesses;
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    return [];
  }
}

export async function createBusinessProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();
  console.log("createBusinessProfile: userId", userId);

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const ownerName = formData.get("ownerName") as string;
  const percentOwnership = parseFloat(formData.get("percentOwnership") as string);
  const businessName = formData.get("businessName") as string;
  const businessType = formData.get("businessType") as string;
  const businessTaxStatus = formData.get("businessTaxStatus") as string;
  const businessDescription = formData.get("businessDescription") as string;
  const businessIndustry = formData.get("businessIndustry") as string;
  const naicsCode = formData.get("naicsCode") as string;
  const streetAddress = formData.get("streetAddress") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;
  const businessMaterials = formData.get("businessMaterials") as File; // Placeholder for file

  console.log("createBusinessProfile: formData fields:", {
    ownerName,
    percentOwnership,
    businessName,
    businessType,
    businessTaxStatus,
    businessDescription,
    businessIndustry,
    naicsCode,
    streetAddress,
    city,
    state,
    zipCode,
    phone,
    website,
    businessMaterials: businessMaterials ? businessMaterials.name : "no file",
  });

  if (!ownerName || isNaN(percentOwnership) || !businessName || !businessType || !businessTaxStatus || !businessIndustry) {
    console.error("createBusinessProfile: Required fields missing or invalid.");
    return { message: "", error: "Required fields are missing." };
  }

  try {
    // Placeholder for file upload logic
    let businessMaterialsUrl: string | undefined;
    if (businessMaterials && businessMaterials.size > 0) {
      // In a real application, you would upload this file to a storage service (e.g., S3, Vercel Blob)
      // and get a URL. For now, we'll just log it.
      console.log("Attempting to upload file:", businessMaterials.name);
      businessMaterialsUrl = "https://example.com/placeholder-material.pdf"; // Placeholder URL
    }

    const newBusinessData: NewBusiness = {
      userId,
      ownerName,
      percentOwnership: percentOwnership.toString(),
      businessName,
      businessType: businessType as typeof businessTypeEnum.enumValues[number],
      businessTaxStatus: businessTaxStatus as typeof businessTaxStatusEnum.enumValues[number],
      businessDescription,
      businessIndustry,
      naicsCode,
      streetAddress,
      city,
      state,
      zipCode,
      phone,
      website,
      businessMaterialsUrl,
    };
    console.log("createBusinessProfile: newBusinessData before insert:", newBusinessData);

    await db.insert(businesses).values(newBusinessData);
    console.log("createBusinessProfile: Business inserted successfully.");

    revalidatePath("/dashboard/businesses");
    return { message: "Business profile created successfully!", error: "" };
  } catch (error) {
    console.error("Error creating business profile:", error);
    let errorMessage = "Failed to create business profile.";
    if (error instanceof Error) {
      errorMessage = `Failed to create business profile: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function updateBusinessProfile(prevState: FormState, formData: FormData): Promise<FormState> {
    const userId = await getUserIdFromSession();
    console.log("updateBusinessProfile: userId", userId);

    if (!userId) {
      return { message: "", error: "User not authenticated." };
    }

    const businessId = parseInt(formData.get("businessId") as string);
    console.log("updateBusinessProfile: businessId", businessId);

    if (isNaN(businessId)) {
      console.error("updateBusinessProfile: Invalid business ID.");
      return { message: "", error: "Business ID is invalid." };
    }

    const ownerName = formData.get("ownerName") as string;
    const percentOwnership = parseFloat(formData.get("percentOwnership") as string);
    const businessName = formData.get("businessName") as string;
    const businessType = formData.get("businessType") as string;
    const businessTaxStatus = formData.get("businessTaxStatus") as string;
    const businessDescription = formData.get("businessDescription") as string;
    const businessIndustry = formData.get("businessIndustry") as string;
    const naicsCode = formData.get("naicsCode") as string;
    const streetAddress = formData.get("streetAddress") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const businessMaterials = formData.get("businessMaterials") as File; // Placeholder for file
    const logo = formData.get("logo") as File; // New: Get logo file
    const businessProfilePhoto = formData.get("businessProfilePhoto") as File; // New: Get business profile photo file

    console.log("updateBusinessProfile: formData fields:", {
      ownerName,
      percentOwnership,
      businessName,
      businessType,
      businessTaxStatus,
      businessDescription,
      businessIndustry,
      naicsCode,
      streetAddress,
      city,
      state,
      zipCode,
      phone,
      website,
      businessMaterials: businessMaterials ? businessMaterials.name : "no file",
      logo: logo ? logo.name : "no file",
      businessProfilePhoto: businessProfilePhoto ? businessProfilePhoto.name : "no file",
    });

    // New: Handle 5 material uploads and titles
    const materialUpdates: { urlField: string; titleField: string; url?: string; title?: string; }[] = [];
    for (let i = 1; i <= 5; i++) {
      const materialFile = formData.get(`material${i}`) as File;
      const materialTitle = formData.get(`material${i}Title`) as string;
      const update: { urlField: string; titleField: string; url?: string; title?: string; } = {
        urlField: `material${i}Url`,
        titleField: `material${i}Title`,
      };

      if (materialFile && materialFile.size > 0) {
        const blob = await put(materialFile.name, materialFile, { access: 'public', allowOverwrite: true });
        update.url = blob.url;
      }
      if (materialTitle) {
        update.title = materialTitle;
      }
      materialUpdates.push(update);
    }

    if (!ownerName || isNaN(percentOwnership) || !businessName || !businessType || !businessTaxStatus || !businessIndustry) {
      console.error("updateBusinessProfile: Required fields missing or invalid.");
      return { message: "", error: "Required fields are missing." };
    }

    try {
      // Placeholder for file upload logic
      let businessMaterialsUrl: string | undefined;
      if (businessMaterials && businessMaterials.size > 0) {
        console.log("Attempting to upload file:", businessMaterials.name);
        businessMaterialsUrl = "https://example.com/placeholder-material.pdf"; // Placeholder URL
      }

      // New: Handle logo upload
      let logoUrl: string | undefined;
      if (logo && logo.size > 0) {
        console.log("updateBusinessProfile: Attempting to upload logo:", logo.name);
        try {
          const uniqueFilename = `${businessId}-${Date.now()}-${logo.name}`;
          const blob = await put(uniqueFilename, logo, { access: 'public', allowOverwrite: true });
          logoUrl = blob.url;
          console.log("updateBusinessProfile: Logo uploaded successfully:", logoUrl);
        } catch (uploadError) {
          console.error("updateBusinessProfile: Error uploading logo:", uploadError);
          // Optionally, return an error to the user or set a default logo
        }
      }

      // New: Handle business profile photo upload
      let businessProfilePhotoUrl: string | undefined;
      if (businessProfilePhoto && businessProfilePhoto.size > 0) {
        console.log("updateBusinessProfile: Attempting to upload business profile photo:", businessProfilePhoto.name);
        try {
          const blob = await put(businessProfilePhoto.name, businessProfilePhoto, { access: 'public', allowOverwrite: true });
          businessProfilePhotoUrl = blob.url;
          console.log("updateBusinessProfile: Business profile photo uploaded successfully:", businessProfilePhotoUrl);
        } catch (uploadError) {
          console.error("updateBusinessProfile: Error uploading business profile photo:", uploadError);
          // Optionally, return an error to the user or set a default photo
        }
      }

      const updateData: Partial<InferInsertModel<typeof businesses>> & { [key: string]: string | number | boolean | undefined | null } = {
        ownerName,
        percentOwnership: percentOwnership.toString(),
        businessName,
        businessType: businessType as typeof businessTypeEnum.enumValues[number],
        businessTaxStatus: businessTaxStatus as typeof businessTaxStatusEnum.enumValues[number],
        businessDescription,
        businessIndustry,
        naicsCode,
        streetAddress,
        city,
        state,
        zipCode,
        phone,
        website,
        businessMaterialsUrl: businessMaterialsUrl || undefined, // Only update if new file uploaded
        logoUrl: logoUrl || undefined, // New: Update logoUrl
        businessProfilePhotoUrl: businessProfilePhotoUrl || undefined, // New: Update business profile photo url
      };

      // Apply material updates
      materialUpdates.forEach(update => {
        if (update.url !== undefined) {
          updateData[update.urlField] = update.url;
        }
        if (update.title !== undefined) {
          updateData[update.titleField] = update.title;
        }
      });
      console.log("updateBusinessProfile: updateData before db.update:", updateData);

      await db.update(businesses)
        .set(updateData)
        .where(eq(businesses.id, businessId));
      console.log("updateBusinessProfile: Business updated successfully.");

      revalidatePath("/dashboard/businesses");
      revalidatePath(`/dashboard/businesses/${businessId}`); // Revalidate specific business page
      return { message: "Business profile updated successfully!", error: "" };
    } catch (error: unknown) {
      console.error("Error updating business profile:", error);
      let errorMessage = "Failed to update business profile.";
      if (error instanceof Error) {
        errorMessage = `Failed to update business profile: ${error.message}`;
      }
      return { message: "", error: errorMessage };
    }
  }


export async function archiveBusiness(businessId: number): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  try {
    await db.update(businesses)
      .set({ isArchived: true })
      .where(eq(businesses.id, businessId));

    revalidatePath("/dashboard/businesses");
    revalidatePath(`/dashboard/businesses/${businessId}`);
    return { message: "Business archived successfully!", error: "" };
  } catch (error) {
    console.error("Error archiving business:", error);
    return { message: "", error: "Failed to archive business." };
  }
}



export async function updateBusinessMaterials(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const businessId = parseInt(formData.get("businessId") as string);

  if (isNaN(businessId)) {
    return { message: "", error: "Business ID is invalid." };
  }

  try {
    const materialUpdates: { urlField: string; titleField: string; url?: string; title?: string; }[] = [];
    for (let i = 1; i <= 5; i++) {
      const materialFile = formData.get(`material${i}`) as File;
      const materialTitle = formData.get(`material${i}Title`) as string;
      const update: { urlField: string; titleField: string; url?: string; title?: string; } = {
        urlField: `material${i}Url`,
        titleField: `material${i}Title`,
      };

      if (materialFile && materialFile.size > 0) {
        const blob = await put(materialFile.name, materialFile, { access: 'public', allowOverwrite: true });
        update.url = blob.url;
      }
      if (materialTitle) {
        update.title = materialTitle;
      }
      materialUpdates.push(update);
    }

    const updateData: Partial<InferInsertModel<typeof businesses>> & { [key: string]: string | number | boolean | undefined | null } = {};

    // Apply material updates
    materialUpdates.forEach(update => {
      if (update.url !== undefined) {
        updateData[update.urlField] = update.url;
      }
      if (update.title !== undefined) {
        updateData[update.titleField] = update.title;
      }
    });

    if (Object.keys(updateData).length > 0) {
      await db.update(businesses)
        .set(updateData)
        .where(eq(businesses.id, businessId));
    }

    revalidatePath(`/dashboard/businesses/${businessId}`);
    return { message: "Business materials updated successfully!", error: "" };
  } catch (error) {
    console.error("Error updating business materials:", error);
    return { message: "", error: "Failed to update business materials." };
  }
}


export async function searchBusinesses(query: string): Promise<Business[]> {
  try {
    const allBusinesses = await db.query.businesses.findMany({
      where: like(businesses.businessName, `%${query}%`),
    });
    return allBusinesses;
  } catch (error) {
    console.error("Error searching businesses:", error);
    return [];
  }
}

export async function getDemographicsByCategory(category: 'Race' | 'Gender' | 'Religion') {
  const demographics = {
    Gender: [
      { id: 1, name: "Male", category: "Gender" as const },
      { id: 2, name: "Female", category: "Gender" as const },
      { id: 3, name: "Non-binary", category: "Gender" as const },
      { id: 4, name: "Prefer not to say", category: "Gender" as const },
    ],
    Race: [
      { id: 5, name: "White", category: "Race" as const },
      { id: 6, name: "Black or African American", category: "Race" as const },
      { id: 7, name: "Asian", category: "Race" as const },
      { id: 8, name: "American Indian or Alaska Native", category: "Race" as const },
      { id: 9, name: "Native Hawaiian or Other Pacific Islander", category: "Race" as const },
      { id: 10, name: "Hispanic or Latino", category: "Race" as const },
      { id: 11, name: "Two or More Races", category: "Race" as const },
      { id: 12, name: "Prefer not to say", category: "Race" as const },
    ],
    Religion: [
      { id: 13, name: "Christianity", category: "Religion" as const },
      { id: 14, name: "Islam", category: "Religion" as const },
      { id: 15, name: "Hinduism", category: "Religion" as const },
      { id: 16, name: "Buddhism", category: "Religion" as const },
      { id: 17, name: "Sikhism", category: "Religion" as const },
      { id: 18, name: "Judaism", category: "Religion" as const },
      { id: 19, name: "Other", category: "Religion" as const },
      { id: 20, name: "None", category: "Religion" as const },
      { id: 21, name: "Prefer not to say", category: "Religion" as const },
    ],
  };
  return demographics[category] || [];
}

export async function getLocationsByCategory(category: 'City' | 'Region') {
  const locations = {
    City: [
      { id: 1, name: "New York", category: "City" as const },
      { id: 2, name: "Los Angeles", category: "City" as const },
      { id: 3, name: "Chicago", category: "City" as const },
      { id: 4, name: "Houston", category: "City" as const },
      { id: 5, name: "Phoenix", category: "City" as const },
    ],
    Region: [
      { id: 6, name: "Northeast", category: "Region" as const },
      { id: 7, name: "Mid-Atlantic (DMV)", category: "Region" as const },
      { id: 8, name: "New England", category: "Region" as const },
      { id: 9, name: "Midwest", category: "Region" as const },
      { id: 10, name: "South", category: "Region" as const },
      { id: 11, name: "Southeast", category: "Region" as const },
      { id: 12, name: "Southwest", category: "Region" as const },
      { id: 13, name: "West", category: "Region" as const },
      { id: 14, name: "Northwest", category: "Region" as const },
      { id: 15, name: "Other", category: "Region" as const },
    ],
  };
  return locations[category] || [];
}

export async function updateBusinessOwnerDetails(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const businessId = parseInt(formData.get("businessId") as string);
  const ownerGenderId = formData.get("ownerGenderId") ? parseInt(formData.get("ownerGenderId") as string) : null;
  const ownerRaceId = formData.get("ownerRaceId") ? parseInt(formData.get("ownerRaceId") as string) : null;
  const ownerReligionId = formData.get("ownerReligionId") ? parseInt(formData.get("ownerReligionId") as string) : null;
  const ownerRegionId = formData.get("ownerRegionId") ? parseInt(formData.get("ownerRegionId") as string) : null;
  const selectedDemographicIdsString = formData.get("selectedDemographicIds") as string; // New: Get business demographic IDs
  const locationId = formData.get("locationId") ? parseInt(formData.get("locationId") as string) : null; // New: Get business location ID

  if (isNaN(businessId)) {
    return { message: "", error: "Invalid business ID." };
  }

  let selectedDemographicIds: number[] = [];
  if (selectedDemographicIdsString) {
    selectedDemographicIds = JSON.parse(selectedDemographicIdsString);
  }

  try {
    const updateData: {
      ownerGenderId?: number | null;
      ownerRaceId?: number | null;
      ownerReligionId?: number | null;
      ownerRegionId?: number | null;
      demographicIds?: number[] | null; // New: Add demographicIds
      locationId?: number | null; // New: Add locationId
    } = {};

    if (ownerGenderId !== null) updateData.ownerGenderId = ownerGenderId;
    if (ownerRaceId !== null) updateData.ownerRaceId = ownerRaceId;
    if (ownerReligionId !== null) updateData.ownerReligionId = ownerReligionId;
    if (ownerRegionId !== null) updateData.ownerRegionId = ownerRegionId;
    
    // New: Add business demographic and location updates
    if (selectedDemographicIds.length > 0) {
      updateData.demographicIds = selectedDemographicIds;
    } else {
      updateData.demographicIds = null; // Set to null if no demographics selected
    }

    if (locationId !== null) {
      updateData.locationId = locationId;
    } else {
      updateData.locationId = null; // Set to null if no location selected
    }

  console.log("updateBusinessOwnerDetails: businessId", businessId);
  console.log("updateBusinessOwnerDetails: updateData", updateData);
    if (Object.keys(updateData).length === 0) {
      return { message: "", error: "No owner or business details to update." };
    }

    await db.update(businesses)
      .set(updateData)
      .where(eq(businesses.id, businessId));

    revalidatePath(`/dashboard/businesses/${businessId}`);
    return { message: "Owner and business details updated successfully!", error: "" };
  } catch (error) {
    console.error("Error updating business owner details:", error);
    let errorMessage = "Failed to update owner and business details.";
    if (error instanceof Error) {
      errorMessage = `Failed to update owner and business details: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function updateBusinessDesign(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const businessId = parseInt(formData.get("businessId") as string);
  const color1 = formData.get("color1") as string;
  const color2 = formData.get("color2") as string;
  const color3 = formData.get("color3") as string;
  const color4 = formData.get("color4") as string;

  if (isNaN(businessId)) {
    return { message: "", error: "Invalid business ID." };
  }

  try {
    const updateData: {
      color1?: string | null;
      color2?: string | null;
      color3?: string | null;
      color4?: string | null;
    } = {};

    if (color1) updateData.color1 = color1; else updateData.color1 = null;
    if (color2) updateData.color2 = color2; else updateData.color2 = null;
    if (color3) updateData.color3 = color3; else updateData.color3 = null;
    if (color4) updateData.color4 = color4; else updateData.color4 = null;

    await db.update(businesses)
      .set(updateData)
      .where(eq(businesses.id, businessId));

    revalidatePath(`/dashboard/businesses/${businessId}`);
    return { message: "Business design updated successfully!", error: "" };
  } catch (error) {
    console.error("Error updating business design:", error);
    let errorMessage = "Failed to update business design.";
    if (error instanceof Error) {
      errorMessage = `Failed to update business design: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
