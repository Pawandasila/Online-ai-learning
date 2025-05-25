import {
  integer,
  pgTable,
  varchar,
  json,
  boolean,
  text,
  bigint
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  noOfModules: integer().notNull(),
  difficultyLevel: varchar({ length: 50 }),
  categories: text(),
  includeVideo: boolean().default(false),
  courseJson: json(),
  courseContent : json().default({}),
  bannerImageUrl: text(),
  userId: varchar()
    .notNull()
    .references(() => usersTable.email, { onDelete: "cascade" }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const enrollCourseTable = pgTable('enrollCourses',{
  id:integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar({length:255}).notNull().references(()=> coursesTable.cid , {onDelete : 'cascade'}),
  userEmail:varchar({length:255}).notNull().references(()=> usersTable.email,{onDelete:'cascade'}),
  status:varchar().default('true'),
  completedChapters:json().default([]),
  progress:varchar().default('0'),
  isCompleted:boolean().default(false),
  certificate:varchar({length:5000}),
})