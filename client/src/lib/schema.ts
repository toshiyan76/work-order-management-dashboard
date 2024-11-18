import { z } from "zod";

export const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().min(1, "Assigned To is required"),
  location: z.string().min(1, "Location is required"),
  dueDate: z.string().min(1, "Due Date is required"),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
