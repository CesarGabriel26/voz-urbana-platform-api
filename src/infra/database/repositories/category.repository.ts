import { Category } from "../../../core/models/category.model";
import { ICategoryRepository } from "../../../core/repositories/category-repository.interface";
import { db } from "../db";

function toCategory(row: any): Category {
    return {
        id: row.id,
        name: row.name,
        weight: row.weight,
        type: row.type,
        description: row.description,
        active: row.active,
        createdAt: row.created_at
    };
}

export class PrismaCategoryRepository implements ICategoryRepository {
    async findById(id: string): Promise<Category | null> {
        const { rows } = await db.query("SELECT * FROM voz_categories WHERE id = $1 LIMIT 1", [id]);
        return rows.length ? toCategory(rows[0]) : null;
    }

    async findAll(filters?: any): Promise<Category[]> {
        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (filters?.active) { conditions.push(`active = $${idx++}`); values.push(filters.active); }
        if (filters?.type) { conditions.push(`type = $${idx++}`); values.push(filters.type); }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const { rows } = await db.query(`SELECT * FROM voz_categories ${where}`, values);
        return rows.map(row => {
            const category = toCategory(row)
            return category
        })
    }

    async create(data: Omit<Category, "id" | "createdAt">): Promise<Category> {
        const { rows } = await db.query(
            `INSERT INTO voz_categories (name, type, weight, description, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [data.name, data.type, data.weight, data.description, data.active]
        );
        return toCategory(rows[0]);
    }

    async update(id: string, data: Partial<Category>): Promise<Category> {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
        if (data.weight !== undefined) { fields.push(`weight = $${idx++}`); values.push(data.weight); }

        if (fields.length === 0) return (await this.findById(id))!;

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const { rows } = await db.query(
            `UPDATE voz_categories SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
            values
        );
        return toCategory(rows[0]);
    }

    async delete(id: string): Promise<void> {
        await db.query("DELETE FROM voz_categories WHERE id = $1", [id]);
    }
}
