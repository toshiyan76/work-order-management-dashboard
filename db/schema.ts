import { pgTable, text, integer, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const statusEnum = pgEnum('status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: statusEnum("status").notNull().default('pending'),
  priority: priorityEnum("priority").notNull().default('medium'),
  assignedTo: text("assigned_to").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
});

// Custom Zod schema for work orders that handles date strings
export const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedTo: z.string().min(1, "Assigned To is required"),
  location: z.string().min(1, "Location is required"),
  dueDate: z.string().min(1, "Due Date is required").transform((str) => new Date(str)),
});

export const insertWorkOrderSchema = createInsertSchema(workOrders, {
  dueDate: z.string().transform((str) => new Date(str)),
});
export const selectWorkOrderSchema = createSelectSchema(workOrders);

export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type WorkOrder = z.infer<typeof selectWorkOrderSchema>;
