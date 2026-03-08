"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPetitionRepository = void 0;
const db_1 = require("../db");
function toPetition(row) {
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
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
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
class PrismaPetitionRepository {
    async create(data) {
        const loc = data.location ?? {};
        const { rows } = await db_1.db.query(`INSERT INTO petitions
        (title, description, category, goal, signatures_count, scope, city_ibge_code,
         visibility, status, latitude, longitude, address, neighborhood,
         formal_document_url, created_by, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`, [
            data.title, data.description, data.category, data.goal, data.signaturesCount ?? 0,
            data.scope, data.cityIbgeCode ?? null, data.visibility ?? "public", data.status ?? "active",
            loc.latitude ?? 0, loc.longitude ?? 0, loc.address ?? "", loc.neighborhood ?? "",
            data.formalDocumentUrl ?? null, data.createdBy, data.expiresAt ?? null
        ]);
        return toPetition(rows[0]);
    }
    async findById(id) {
        const { rows } = await db_1.db.query("SELECT * FROM petitions WHERE id = $1 LIMIT 1", [id]);
        return rows.length ? toPetition(rows[0]) : null;
    }
    async findAll(filters) {
        const conditions = [];
        const values = [];
        let idx = 1;
        if (filters?.status) {
            conditions.push(`status = $${idx++}`);
            values.push(filters.status);
        }
        if (filters?.scope) {
            conditions.push(`scope = $${idx++}`);
            values.push(filters.scope);
        }
        if (filters?.category) {
            conditions.push(`category = $${idx++}`);
            values.push(filters.category);
        }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const { rows } = await db_1.db.query(`SELECT * FROM petitions ${where} ORDER BY created_at DESC`, values);
        return rows.map(toPetition);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        const allowed = ["title", "description", "category", "goal", "status", "visibility", "expiresAt"];
        const colMap = { expiresAt: "expires_at" };
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
        const { rows } = await db_1.db.query(`UPDATE petitions SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
        return toPetition(rows[0]);
    }
    async sign(petitionId, signatureData) {
        const client = await db_1.db.connect();
        try {
            await client.query("BEGIN");
            await client.query(`INSERT INTO petition_signatures
          (petition_id, user_id, voter_registration_number, full_name, cpf_hash, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                petitionId,
                signatureData.userId,
                signatureData.voterRegistrationNumber ?? null,
                signatureData.fullName,
                signatureData.cpfHash,
                signatureData.ipAddress,
                signatureData.userAgent
            ]);
            await client.query("UPDATE petitions SET signatures_count = signatures_count + 1 WHERE id = $1", [petitionId]);
            await client.query("COMMIT");
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    }
}
exports.PrismaPetitionRepository = PrismaPetitionRepository;
