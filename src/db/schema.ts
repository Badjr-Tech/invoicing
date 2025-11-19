import { pgTable, serial, text, varchar, pgEnum, boolean, integer, numeric, timestamp, AnyPgColumn } from 'drizzle-orm/pg-core';
import { relations, InferSelectModel } from 'drizzle-orm';

export const userRole = pgEnum('user_role', ['admin', 'internal', 'external']);
export const businessTypeEnum = pgEnum('business_type', ['Sole Proprietorship', 'Partnership', 'Limited Liability Company (LLC)', 'Corporation']);
export const businessTaxStatusEnum = pgEnum('business_tax_status', ['S-Corporation', 'C-Corporation', 'Not Applicable']);
export const classTypeEnum = pgEnum('class_type', ['pre-course', 'agency-course']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'completed', 'dropped', 'pending', 'rejected']);
export const invoiceStatus = pgEnum('invoice_status', ['draft', 'sent', 'paid']);
export const serviceDesignationEnum = pgEnum('service_designation', ['hourly', 'per deliverable', 'flat fee']); // New Enum

// --- Tables ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: text('email').notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  role: userRole('role').notNull().default('internal'),
  hasBusinessProfile: boolean('has_business_profile').notNull().default(false),
  personalAddress: text('personal_address'),
  personalCity: text('personal_city'),
  personalState: varchar('personal_state', { length: 2 }),
  personalZipCode: varchar('personal_zip_code', { length: 10 }),
  profilePhotoUrl: text('profile_photo_url'),
  isOptedOut: boolean('is_opted_out').notNull().default(false),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  businessId: integer('business_id').notNull().references(() => businesses.id), // New foreign key
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  invoiceBusinessDisplayName: text('invoice_business_display_name').notNull(), // New field for the name displayed on the invoice
  servicesJson: text('services_json').notNull(), // Changed from serviceDescription
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatus('status').notNull().default('draft'),
  isArchived: boolean('is_archived').notNull().default(false), // New column
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  invoiceNumber: varchar('invoice_number', { length: 256 }).notNull(), // New
  notes: text('notes'), // New
});

export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  businessName: text('business_name').notNull(),
  legalBusinessName: text('legal_business_name'),
  ownerName: text('owner_name').notNull(),
  percentOwnership: numeric('percent_ownership').notNull(),
  businessType: businessTypeEnum('business_type').notNull(),
  businessTaxStatus: businessTaxStatusEnum('business_tax_status').notNull(),
  businessDescription: text('business_description'),
  businessIndustry: text('business_industry').notNull(),
  naicsCode: varchar('naics_code', { length: 6 }),
  logoUrl: text('logo_url'),
  businessProfilePhotoUrl: text('business_profile_photo_url'),
  businessMaterialsUrl: text('business_materials_url'),
  streetAddress: text('street_address'),
  city: text('city'),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  website: text('website'),
  isArchived: boolean('is_archived').notNull().default(false),
  locationId: integer('location_id'),
  demographicIds: integer('demographic_ids').array(),
  ownerGenderId: integer('owner_gender_id'), // New optional foreign key
  ownerRaceId: integer('owner_race_id'), // New optional foreign key
  ownerReligionId: integer('owner_religion_id'), // New optional foreign key
  ownerRegionId: integer('owner_region_id'), // New optional foreign key
  material1Url: text('material1_url'),
  material1Title: text('material1_title'),
  material2Url: text('material2_url'),
  material2Title: text('material2_title'),
  material3Url: text('material3_url'),
  material3Title: text('material3_title'),
  material4Url: text('material4_url'),
  material4Title: text('material4_title'),
  material5Url: text('material5_url'),
  material5Title: text('material5_title'),
  color1: text('color1'), // New optional column for business color scheme
  color2: text('color2'), // New optional column for business color scheme
  color3: text('color3'), // New optional column for business color scheme
  color4: text('color4'), // New optional column for business color scheme
  taxFullName: text('tax_full_name'), // New optional column for tax full name
});

export const dbas = pgTable('dbas', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => businesses.id),
  name: text('name').notNull(),
  description: text('description'),
  color1: text('color1'),
  color2: text('color2'),
  color3: text('color3'),
  color4: text('color4'),
  upload1: text('upload1'),
  upload2: text('upload2'),
  upload3: text('upload3'),
});

export const massMessages = pgTable('mass_messages', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  targetLocationIds: integer('target_location_ids').array(),
  targetDemographicIds: integer('target_demographic_ids').array(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

export const individualMessages = pgTable('individual_messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => users.id),
  recipientId: integer('recipient_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  read: boolean('read').notNull().default(false),
  replyToMessageId: integer('reply_to_message_id').references((): AnyPgColumn => individualMessages.id),
});





export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  teacherId: integer('teacher_id').notNull().references(() => users.id),
  type: classTypeEnum('type').notNull().default('agency-course'),
  syllabusUrl: text('syllabus_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id),
  title: text('title').notNull(),
  content: text('content'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  classId: integer('class_id').notNull().references(() => classes.id),
  status: enrollmentStatusEnum('status').notNull().default('pending'),
  enrollmentDate: timestamp('enrollment_date', { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  businessId: integer('business_id').references(() => businesses.id), // Re-added optional foreign key
  name: text('name').notNull(),
  email: text('email').notNull(),
  clientBusinessName: text('client_business_name'), // New optional column
});

export const serviceCategories = pgTable('service_categories', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  businessId: integer('business_id').references(() => businesses.id), // New optional foreign key
  name: text('name').notNull(),
  customId: text('custom_id'), // New optional column for custom identifier
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  businessId: integer('business_id').references(() => businesses.id),
  categoryId: integer('category_id').references(() => serviceCategories.id), // New foreign key
  name: text('name').notNull(),
  designation: serviceDesignationEnum('designation').notNull().default('flat fee'), // New column
  serviceNumber: text('service_number'), // New column
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export type Service = InferSelectModel<typeof services> & {
  quantity: number;
};

// Explicitly define types for Drizzle models to ensure consistency
export interface DemographicType {
  id: number;
  name: string;
  category: 'Race' | 'Gender' | 'Religion';
}

export interface LocationType {
  id: number;
  name: string;
  category: 'City' | 'Region';
}

export type Demographic = DemographicType;
export type Location = LocationType;

export type Dba = InferSelectModel<typeof dbas>; // Define Dba type

export type Business = InferSelectModel<typeof businesses> & {
  dbas?: Dba[]; // Make dbas an optional array of Dba
};
export type BusinessWithDemographic = InferSelectModel<typeof businesses> & { demographic: Demographic | null };
export type BusinessWithLocation = InferSelectModel<typeof businesses> & { location: Location | null };
export type BusinessWithDemographicAndLocation = InferSelectModel<typeof businesses> & { demographic: Demographic | null, location: Location | null };
export type MassMessage = InferSelectModel<typeof massMessages>;
export type IndividualMessage = InferSelectModel<typeof individualMessages>;

export type ServiceCategory = InferSelectModel<typeof serviceCategories>; // New type
export type Client = InferSelectModel<typeof clients>; // New type
export type ClientWithBusiness = InferSelectModel<typeof clients> & { business: Business | null }; // Re-added type

// --- Relations ---
export const checklistItems = pgTable('checklist_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  category: text('category').notNull(),
  text: text('text').notNull(),
  isChecked: boolean('is_checked').notNull().default(false),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  businesses: many(businesses),
  sentMessages: many(individualMessages, { relationName: 'sent_messages' }),
  receivedMessages: many(individualMessages, { relationName: 'received_messages' }),
  enrollments: many(enrollments),
  passwordResetTokens: many(passwordResetTokens),
  invoices: many(invoices),
  clients: many(clients),
  services: many(services),
  serviceCategories: many(serviceCategories), // New relation
  checklistItems: many(checklistItems),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  business: one(businesses, { // New relation
    fields: [invoices.businessId],
    references: [businesses.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  business: one(businesses, { // Re-added relation
    fields: [clients.businessId],
    references: [businesses.id],
  }),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [serviceCategories.userId],
    references: [users.id],
  }),
  business: one(businesses, { // New relation
    fields: [serviceCategories.businessId],
    references: [businesses.id],
  }),
  services: many(services), // New relation
}));

export const servicesRelations = relations(services, ({ one }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [services.businessId],
    references: [businesses.id],
  }),
  category: one(serviceCategories, { // New relation
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, {
    fields: [businesses.userId],
    references: [users.id],
  }),
  dbas: many(dbas),
}));

export const dbasRelations = relations(dbas, ({ one }) => ({
  business: one(businesses, {
    fields: [dbas.businessId],
    references: [businesses.id],
  }),
}));

export const massMessagesRelations = relations(massMessages, ({ one }) => ({
  admin: one(users, {
    fields: [massMessages.adminId],
    references: [users.id],
  }),
}));

export const individualMessagesRelations = relations(individualMessages, ({ one }) => ({
  sender: one(users, {
    fields: [individualMessages.senderId],
    references: [users.id],
    relationName: 'sent_messages',
  }),
  recipient: one(users, {
    fields: [individualMessages.recipientId],
    references: [users.id],
    relationName: 'received_messages',
  }),
  replyToMessage: one(individualMessages, {
    fields: [individualMessages.replyToMessageId],
    references: [individualMessages.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  lessons: many(lessons),
  enrollments: many(enrollments),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  class: one(classes, {
    fields: [lessons.classId],
    references: [classes.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));