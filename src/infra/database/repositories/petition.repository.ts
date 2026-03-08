import { IPetitionRepository } from "../../../core/repositories/petition-repository.interface";
import { Petition } from "../../../core/models/petition.model";
import { db } from "../db";

function toPetition(row: any): Petition {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    goal: row.goal,
    signaturesCount: row.signatures_count,
    scope: row.scope,
    cityIbgeCode: row.city_ibge_code,
    visibility: row.visibility,
    status: row.status,
    location: {
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      address: row.address,
      neighborhood: row.neighborhood,
    },
    formalDocumentUrl: row.formal_document_url,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

export class PrismaPetitionRepository implements IPetitionRepository {
  async create(data: any): Promise<Petition> {
    const loc = data.location ?? {};
    const { rows } = await db.query(
      `INSERT INTO voz_petitions
        (title, description, category, goal, signatures_count, scope, city_ibge_code,
         visibility, status, lat, lng, address, neighborhood,
         formal_document_url, created_by, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [
        data.title, data.description, data.category, data.goal, data.signaturesCount ?? 0,
        data.scope, data.cityIbgeCode ?? null, data.visibility ?? "public", data.status ?? "active",
        loc.latitude ?? 0, loc.longitude ?? 0, loc.address ?? "", loc.neighborhood ?? "",
        data.formalDocumentUrl ?? null, data.createdBy, data.expiresAt ?? null
      ]
    );
    return toPetition(rows[0]);
  }

  async findById(id: string): Promise<Petition | null> {
    const { rows } = await db.query(`
        select vp.*, count(vps.id) as signatures_count from voz_petitions vp
        left join voz_petition_signatures vps on vps.petition_id = vp.id
        where vp.id = $1
        GROUP BY vp.id`, [id]);
    return rows.length ? toPetition(rows[0]) : null;
  }

  async findAll(filters?: any): Promise<Petition[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filters?.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters?.scope) { conditions.push(`scope = $${idx++}`); values.push(filters.scope); }
    if (filters?.category) { conditions.push(`category = $${idx++}`); values.push(filters.category); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await db.query(`
        select vp.*, count(vps.id) as signatures_count from voz_petitions vp
        left join voz_petition_signatures vps on vps.petition_id = vp.id
        ${where} GROUP BY vp.id ORDER BY created_at DESC`, values);
    return rows.map(toPetition);
  }

  async update(id: string, data: any): Promise<Petition> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed = ["title", "description", "category", "goal", "status", "visibility", "expiresAt"];
    const colMap: Record<string, string> = { expiresAt: "expires_at" };

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
      `UPDATE voz_petitions SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return toPetition(rows[0]);
  }

  async sign(petitionId: string, signatureData: any): Promise<void> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO voz_petition_signatures
          (petition_id, user_id, voter_registration_number, full_name, cpf_hash, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          petitionId,
          signatureData.userId,
          signatureData.voterRegistrationNumber ?? null,
          signatureData.fullName,
          signatureData.cpfHash,
          signatureData.ipAddress,
          signatureData.userAgent
        ]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
