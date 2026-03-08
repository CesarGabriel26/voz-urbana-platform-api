"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const db_1 = require("../db");
function toUser(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        cpf: row.cpf,
        birthDate: row.birth_date,
        phoneNumber: row.phone_number,
        avatarUrl: row.avatar_url,
        role: row.role,
        password: row.password,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class PrismaUserRepository {
    async findByEmail(email) {
        const { rows } = await db_1.db.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
        return rows.length ? toUser(rows[0]) : null;
    }
    async findByCpf(cpf) {
        const { rows } = await db_1.db.query("SELECT * FROM users WHERE cpf = $1 LIMIT 1", [cpf]);
        return rows.length ? toUser(rows[0]) : null;
    }
    async findById(id) {
        const { rows } = await db_1.db.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
        return rows.length ? toUser(rows[0]) : null;
    }
    async create(data) {
        const { rows } = await db_1.db.query(`INSERT INTO users (name, email, cpf, birth_date, phone_number, avatar_url, role, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [data.name, data.email, data.cpf, data.birthDate, data.phoneNumber, data.avatarUrl, data.role, data.password]);
        return toUser(rows[0]);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (data.name !== undefined) {
            fields.push(`name = $${idx++}`);
            values.push(data.name);
        }
        if (data.phoneNumber !== undefined) {
            fields.push(`phone_number = $${idx++}`);
            values.push(data.phoneNumber);
        }
        if (data.avatarUrl !== undefined) {
            fields.push(`avatar_url = $${idx++}`);
            values.push(data.avatarUrl);
        }
        if (data.role !== undefined) {
            fields.push(`role = $${idx++}`);
            values.push(data.role);
        }
        if (fields.length === 0)
            return (await this.findById(id));
        fields.push(`updated_at = NOW()`);
        values.push(id);
        const { rows } = await db_1.db.query(`UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
        return toUser(rows[0]);
    }
    async updateRefreshToken(_userId, _refreshToken) {
        // Stateless JWT — no-op
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
