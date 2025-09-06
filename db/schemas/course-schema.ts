import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export interface CourseLink {
  id: string;
  url: string;
  platform: string;
  label?: string;
}

export interface Quiz {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export interface Lesson {
  title: string;
  content: string;
  quiz: Quiz;
}

export type CourseContent = string | Lesson[];

export const CONTENT_TYPES = {
  BLOG: "blog",
  LISTICLE: "listicle",
  COURSE: "course",
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

export const course = pgTable("course", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: json("content").$type<CourseContent>().notNull(),
  originalContent: json("original_content").$type<CourseContent>().notNull(),
  contentType: text("content_type")
    .notNull()
    .default(CONTENT_TYPES.BLOG)
    .$type<ContentType>(),
  tags: json("tags").$type<string[]>().notNull().default([]),
  keyPoints: json("key_points").$type<string[]>().notNull().default([]),
  links: json("links").$type<CourseLink[]>().notNull().default([]),
  estimatedReadTime: integer("estimated_read_time").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(false),
  polarProductId: text("polar_product_id"),
  polarProductSlug: text("polar_product_slug"),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const coursePurchase = pgTable("course_purchase", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  polarOrderId: text("polar_order_id"),
  unlockToken: text("unlock_token"),
  accessCode: text("access_code").unique(),
  purchaseDate: timestamp("purchase_date")
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export type NewCourse = typeof course.$inferInsert;
export type Course = typeof course.$inferSelect;
export type NewCoursePurchase = typeof coursePurchase.$inferInsert;
export type CoursePurchase = typeof coursePurchase.$inferSelect;
