import { IComplaintRepository } from "../../../core/repositories/complaint-repository.interface";
import { Complaint } from "../../../core/models/complaint.model";
import { db } from "../db";

import { PriorityService } from "../../services/priority.service";
import { COMPLAINT_STATUS } from "../../../core/constants/status.constants";

const priorityService = new PriorityService();

function toComplaint(row: any): Complaint {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    category_name: row.category_name,
    priority: row.priority,
    visibility: row.visibility,
    status: Number(row.status),
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    address: row.address,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
    votes: parseInt(row.votes || "0"),
    urgency_level: row.urgency_level || 0
  };
}

async function getPriorityFactors(row: any) {
  const [densityRes, recurrenceRes] = await Promise.all([
    db.query(
      `SELECT COUNT(*) FROM voz_complaints 
       WHERE ST_DWithin(location::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography, 200) 
       AND status != $4 AND id != $3`,
      [row.lng, row.lat, row.id, COMPLAINT_STATUS.RESOLVED]
    ),
    db.query(
      `SELECT COUNT(*) FROM voz_complaints 
       WHERE ST_DWithin(location::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography, 50) 
       AND created_at > now() - interval '1 year' AND id != $3`,
      [row.lng, row.lat, row.id]
    )
  ]);

  return {
    density: parseInt(densityRes.rows[0].count),
    recurrence: parseInt(recurrenceRes.rows[0].count),
    urgency: row.urgency_level || 0
  };
}

export class PrismaComplaintRepository implements IComplaintRepository {
  async create(data: any): Promise<Complaint> {
    const { rows } = await db.query(
      `INSERT INTO voz_complaints (title, description, category, priority, visibility, status, lat, lng, address, created_by, location, urgency_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_SetSRID(ST_Point($8, $7), 4326), $11)
       RETURNING *`,
      [
        data.title, data.description, data.category,
        0, data.visibility ?? "public", data.status ?? COMPLAINT_STATUS.PENDING,
        data.lat, data.lng, data.address ?? null, data.createdBy,
        data.urgency_level ?? 0
      ]
    );
    return toComplaint(rows[0]);
  }

  async findById(id: string): Promise<Complaint | null> {
    const { rows } = await db.query(
      `SELECT c.*, cat.weight, cat.name as category_name, count(vcv.user_id) as votes
      FROM voz_complaints c
      LEFT JOIN voz_complaint_votes vcv on vcv.complaint_id = c.id
      LEFT JOIN voz_categories cat ON cat.id = c.category
      WHERE c.id = $1
      group by c.id, cat.weight, cat.name
     LIMIT 1`,
      [id]
    )

    if (!rows.length) return null

    const row = rows[0];
    const complaint = toComplaint(row);
    const factors = await getPriorityFactors(row);

    complaint.priority = Number(
      (priorityService.calculatePriority(
        complaint,
        row.weight ?? 1,
        factors
      ) / 10).toFixed(2)
    );

    return complaint;
  }

  async findAll(filters?: any): Promise<Complaint[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filters?.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters?.category) { conditions.push(`category = $${idx++}`); values.push(filters.category); }
    if (filters?.createdBy) { conditions.push(`created_by = $${idx++}`); values.push(filters.createdBy); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await db.query(
      `SELECT c.*, cat.weight, cat.name as category_name, count(vcv.user_id) as votes
      FROM voz_complaints c
      LEFT JOIN voz_complaint_votes vcv on vcv.complaint_id = c.id
      LEFT JOIN voz_categories cat ON cat.id = c.category
      ${where}
      group by c.id, cat.weight, cat.name
      `,
      values
    )

    const complaints = await Promise.all(rows.map(async row => {
      const complaint = toComplaint(row);
      const factors = await getPriorityFactors(row);

      complaint.priority = Number(
        (priorityService.calculatePriority(
          complaint,
          row.weight ?? 1,
          factors
        ) / 10).toFixed(2)
      );

      return complaint;
    }));

    return complaints;
  }

  async update(id: string, data: any): Promise<Complaint> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed = ["title", "description", "category", "priority", "visibility", "status", "address", "resolvedAt", "lat", "lng", "urgency_level"];
    const colMap: Record<string, string> = { resolvedAt: "resolved_at" };

    for (const key of allowed) {
      if (data[key] !== undefined) {
        const col = colMap[key] ?? key;
        fields.push(`${col} = $${idx++}`);
        values.push(data[key]);
      }
    }

    // Update location if lat or lng changes
    if (data.lat !== undefined || data.lng !== undefined) {
      const currentData = await this.findById(id);
      const lat = data.lat !== undefined ? data.lat : currentData?.lat;
      const lng = data.lng !== undefined ? data.lng : currentData?.lng;
      fields.push(`location = ST_SetSRID(ST_Point($${idx++}, $${idx++}), 4326)`);
      values.push(lng, lat);
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
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await db.query(
        "INSERT INTO voz_complaint_votes (user_id, complaint_id) VALUES ($1, $2)",
        [userId, complaintId]
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
  async findVotersByComplaintId(complaintId: string): Promise<string[]> {
    const { rows } = await db.query(
      "SELECT user_id FROM voz_complaint_votes WHERE complaint_id = $1",
      [complaintId]
    );
    return rows.map(r => r.user_id);
  }
}
