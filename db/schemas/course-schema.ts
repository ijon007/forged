import { pgTable, text, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const course = pgTable("course", {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  originalContent: text('original_content').notNull(),
  tags: json('tags').$type<string[]>().notNull().default([]),
  keyPoints: json('key_points').$type<string[]>().notNull().default([]),
  estimatedReadTime: integer('estimated_read_time').notNull(),
  price: integer('price').notNull(), // Store price in cents to avoid floating point issues
  imageUrl: text('image_url'), // URL for blog post hero image
  published: boolean('published').notNull().default(false),
  // Polar product fields
  polarProductId: text('polar_product_id'), // Polar product ID
  polarProductSlug: text('polar_product_slug'), // Polar product slug
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

// Simple table to track course purchases
export const coursePurchase = pgTable("course_purchase", {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull().references(() => course.id, { onDelete: 'cascade' }),
  polarOrderId: text('polar_order_id'),
  unlockToken: text('unlock_token'),
  accessCode: text('access_code').unique(),
  purchaseDate: timestamp('purchase_date').$defaultFn(() => new Date()).notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
});

export type NewCourse = typeof course.$inferInsert;
export type Course = typeof course.$inferSelect;
export type NewCoursePurchase = typeof coursePurchase.$inferInsert;
export type CoursePurchase = typeof coursePurchase.$inferSelect; 