import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// This app currently displays one hard-coded signed-in demo profile and has no
// authentication middleware. Keep the account scope server-owned rather than
// trusting a user ID supplied by the browser; replace this with the verified
// authenticated principal when a real sign-in flow is added.
const currentDemoUserId = "demo-saebom-pharmacy";
const productIdPattern = /^[a-zA-Z0-9_-]{1,64}$/;

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/favorites", async (_req, res) => {
    try {
      const favoriteProductIds = await storage.getFavoriteProductIds(currentDemoUserId);
      res.json({ favoriteProductIds });
    } catch (error) {
      console.error("Failed to load favorite products", error);
      res.status(500).json({ message: "즐겨찾기를 불러오지 못했습니다." });
    }
  });

  app.put("/api/favorites/:productId", async (req, res) => {
    const { productId } = req.params;
    if (!productIdPattern.test(productId)) {
      res.status(400).json({ message: "올바르지 않은 품목입니다." });
      return;
    }

    try {
      const favoriteProductIds = await storage.setFavoriteProduct(currentDemoUserId, productId, true);
      res.json({ favoriteProductIds });
    } catch (error) {
      console.error("Failed to add favorite product", error);
      res.status(500).json({ message: "즐겨찾기를 저장하지 못했습니다." });
    }
  });

  app.delete("/api/favorites/:productId", async (req, res) => {
    const { productId } = req.params;
    if (!productIdPattern.test(productId)) {
      res.status(400).json({ message: "올바르지 않은 품목입니다." });
      return;
    }

    try {
      const favoriteProductIds = await storage.setFavoriteProduct(currentDemoUserId, productId, false);
      res.json({ favoriteProductIds });
    } catch (error) {
      console.error("Failed to remove favorite product", error);
      res.status(500).json({ message: "즐겨찾기를 해제하지 못했습니다." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
