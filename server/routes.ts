import type { Express, Request, Response } from "express";
import { db } from "../db";
import { workOrders, insertWorkOrderSchema } from "../db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";
import { ZodError } from "zod";

function logError(error: unknown, context: string) {
  if (error instanceof ZodError) {
    console.error(`Validation error in ${context}:`, error.errors);
  } else if (error instanceof Error) {
    console.error(`Error in ${context}:`, error.message);
  } else {
    console.error(`Unknown error in ${context}:`, error);
  }
}

export function registerRoutes(app: Express) {
  app.get("/api/work-orders", async (req: Request, res: Response) => {
    try {
      const { status, priority, search } = req.query;
      let query = db.select().from(workOrders);
      
      if (status) {
        query = query.where(eq(workOrders.status, status as string));
      }
      if (priority) {
        query = query.where(eq(workOrders.priority, priority as string));
      }
      if (search) {
        query = query.where(
          or(
            like(workOrders.title, `%${search}%`),
            like(workOrders.description, `%${search}%`)
          )
        );
      }
      
      const orders = await query.orderBy(desc(workOrders.createdAt));
      res.json(orders);
    } catch (error) {
      logError(error, "GET /api/work-orders");
      res.status(500).json({ 
        error: "Failed to fetch work orders",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });

  app.post("/api/work-orders", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkOrderSchema.parse(req.body);
      
      // Ensure dates are properly formatted
      const formattedData = {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(validatedData.dueDate)
      };

      const [newOrder] = await db.insert(workOrders)
        .values(formattedData)
        .returning();

      console.log("Created new work order:", newOrder);
      res.status(201).json(newOrder);
    } catch (error) {
      logError(error, "POST /api/work-orders");
      
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Invalid work order data",
          details: error.errors
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create work order",
          details: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }
  });

  app.put("/api/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData = insertWorkOrderSchema.partial().parse(req.body);
      
      const [updated] = await db.update(workOrders)
        .set({ 
          ...validatedData,
          updatedAt: new Date()
        })
        .where(eq(workOrders.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Work order not found" });
      }

      res.json(updated);
    } catch (error) {
      logError(error, `PUT /api/work-orders/${req.params.id}`);
      
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Invalid work order data",
          details: error.errors
        });
      } else {
        res.status(500).json({ 
          error: "Failed to update work order",
          details: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }
  });

  app.delete("/api/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(workOrders)
        .where(eq(workOrders.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Work order not found" });
      }

      res.json({ success: true, deleted });
    } catch (error) {
      logError(error, `DELETE /api/work-orders/${req.params.id}`);
      res.status(500).json({ 
        error: "Failed to delete work order",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });

  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const [pending, inProgress, completed] = await Promise.all([
        db.select().from(workOrders).where(eq(workOrders.status, 'pending')),
        db.select().from(workOrders).where(eq(workOrders.status, 'in_progress')),
        db.select().from(workOrders).where(eq(workOrders.status, 'completed'))
      ]);

      res.json({
        pending: pending.length,
        inProgress: inProgress.length,
        completed: completed.length
      });
    } catch (error) {
      logError(error, "GET /api/stats");
      res.status(500).json({ 
        error: "Failed to fetch statistics",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });
}
