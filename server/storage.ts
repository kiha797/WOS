import { sql } from "./db";

export interface IStorage {
  getFavoriteProductIds(userId: string): Promise<string[]>;
  setFavoriteProduct(userId: string, productId: string, favorite: boolean): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getFavoriteProductIds(userId: string): Promise<string[]> {
    const rows = await sql`
      SELECT COALESCE(json_agg(product_id), '[]'::json) AS favorite_product_ids
      FROM user_favorites
      WHERE user_id = ${userId}
    `;

    return rows[0]?.favorite_product_ids ?? [];
  }

  async setFavoriteProduct(userId: string, productId: string, favorite: boolean): Promise<string[]> {
    if (favorite) {
      await sql`
        WITH inserted AS (
          INSERT INTO user_favorites (user_id, product_id)
          VALUES (${userId}, ${productId})
          ON CONFLICT (user_id, product_id) DO NOTHING
          RETURNING product_id
        )
        SELECT COUNT(*)::integer AS affected FROM inserted
      `;
    } else {
      await sql`
        WITH deleted AS (
          DELETE FROM user_favorites
          WHERE user_id = ${userId} AND product_id = ${productId}
          RETURNING product_id
        )
        SELECT COUNT(*)::integer AS affected FROM deleted
      `;
    }

    return this.getFavoriteProductIds(userId);
  }
}

export const storage = new DatabaseStorage();