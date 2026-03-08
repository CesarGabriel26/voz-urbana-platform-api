"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplaintRepository = void 0;
const db_1 = require("../db");
function toComplaint(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        visibility: row.visibility,
        status: row.status,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        address: row.address,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        resolvedAt: row.resolved_at,
    };
}
class PrismaComplaintRepository {
    async create(data) {
        const { rows } = await db_1.db.query(`INSERT INTO complaints (title, description, category, priority, visibility, status, lat, lng, address, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`, [
            data.title, data.description, data.category,
            data.priority ?? 0, data.visibility ?? "public", data.status ?? "pending",
            data.lat, data.lng, data.address ?? null, data.createdBy
        ]);
        return toComplaint(rows[0]);
    }
    async findById(id) {
        const { rows } = await db_1.db.query("SELECT * FROM complaints WHERE id = $1 LIMIT 1", [id]);
        return rows.length ? toComplaint(rows[0]) : null;
    }
    async findAll(filters) {
        const conditions = [];
        const values = [];
        let idx = 1;
        if (filters?.status) {
            conditions.push(`status = $${idx++}`);
            values.push(filters.status);
        }
        if (filters?.category) {
            conditions.push(`category = $${idx++}`);
            values.push(filters.category);
        }
        if (filters?.createdBy) {
            conditions.push(`created_by = $${idx++}`);
            values.push(filters.createdBy);
        }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const { rows } = await db_1.db.query(`SELECT * FROM complaints ${where} ORDER BY created_at DESC`, values);
        return rows.map(toComplaint);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        const allowed = ["title", "description", "category", "priority", "visibility", "status", "address", "resolvedAt"];
        const colMap = { resolvedAt: "resolved_at" };
        for (const key of allowed) {
            if (data[key] !== undefined) {
                const col = colMap[key] ?? key;
                fields.push(`${col} = $${idx++}`);
                values.push(data[key]);
            }
        }
        if (fields.length === 0)
            return (await this.findById(id));
        fields.push(`updated_at = NOW()`);
        values.push(id);
        const { rows } = await db_1.db.query(`UPDATE complaints SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
        return toComplaint(rows[0]);
    }
    async delete(id) {
        await db_1.db.query("DELETE FROM complaints WHERE id = $1", [id]);
    }
    async vote(complaintId, userId) {
        await db_1.db.query("INSERT INTO complaint_votes (user_id, complaint_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, complaintId]);
    }
}
exports.PrismaComplaintRepository = PrismaComplaintRepository;
