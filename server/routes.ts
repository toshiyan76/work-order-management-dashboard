import type { Express } from "express";
import { db } from "../db";
import { workOrders } from "../db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";

export function registerRoutes(app: Express) {
  app.get("/api/work-orders", async (req, res) => {
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
      res.status(500).json({ error: "Failed to fetch work orders" });
    }
  });

  app.post("/api/work-orders", async (req, res) => {
    try {
      const newOrder = await db.insert(workOrders).values(req.body).returning();
      res.json(newOrder[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create work order" });
    }
  });

  app.put("/api/work-orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.update(workOrders)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(workOrders.id, parseInt(id)))
        .returning();
      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update work order" });
    }
  });

  app.delete("/api/work-orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(workOrders).where(eq(workOrders.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete work order" });
    }
  });

  app.get("/api/stats", async (req, res) => {
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
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });
}
