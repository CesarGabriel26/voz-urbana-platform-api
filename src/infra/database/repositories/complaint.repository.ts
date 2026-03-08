import { IComplaintRepository } from "../../../core/repositories/complaint-repository.interface";
import { Complaint } from "../../../core/models/complaint.model";
import { db } from "../db";

function toComplaint(row: any): Complaint {
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

export class PrismaComplaintRepository implements IComplaintRepository {
  async create(data: any): Promise<Complaint> {
    const { rows } = await db.query(
      `INSERT INTO voz_complaints (title, description, category, priority, visibility, status, lat, lng, address, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.title, data.description, data.category,
        data.priority ?? 0, data.visibility ?? "public", data.status ?? "pending",
        data.lat, data.lng, data.address ?? null, data.createdBy
      ]
    );
    return toComplaint(rows[0]);
  }

  async findById(id: string): Promise<Complaint | null> {
    const { rows } = await db.query("SELECT * FROM voz_complaints WHERE id = $1 LIMIT 1", [id]);
    return rows.length ? toComplaint(rows[0]) : null;
  }

  async findAll(filters?: any): Promise<Complaint[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filters?.status)   { conditions.push(`status = $${idx++}`);   values.push(filters.status); }
    if (filters?.category) { conditions.push(`category = $${idx++}`); values.push(filters.category); }
    if (filters?.createdBy){ conditions.push(`created_by = $${idx++}`); values.push(filters.createdBy); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await db.query(`SELECT * FROM voz_complaints ${where} ORDER BY created_at DESC`, values);
    return rows.map(toComplaint);
  }

  async update(id: string, data: any): Promise<Complaint> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed = ["title", "description", "category", "priority", "visibility", "status", "address", "resolvedAt"];
    const colMap: Record<string, string> = { resolvedAt: "resolved_at" };

    for (const key of allowed) {
      if (data[key] !== undefined) {
        const col = colMap[key] ?? key;
        fields.push(`${col} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return (await this.findById(id))!;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE voz_complaints SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return toComplaint(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await db.query("DELETE FROM voz_complaints WHERE id = $1", [id]);
  }

  async vote(complaintId: string, userId: string): Promise<void> {
    await db.query(
      "INSERT INTO voz_complaint_votes (user_id, complaint_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, complaintId]
    );
  }
}
