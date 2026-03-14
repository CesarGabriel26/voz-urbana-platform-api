import { IUserRepository } from "../../../core/repositories/user-repository.interface";
import { User } from "../../../core/models/user.model";
import { db } from "../db";

function toUser(row: any): User & { password: string } {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    cpf: row.cpf,
    birthDate: row.birth_date,
    phoneNumber: row.phone_number,
    avatarUrl: row.avatar_url,
    role: row.role,
    password: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await db.query("SELECT * FROM voz_users WHERE email = $1 LIMIT 1", [email]);
    return rows.length ? toUser(rows[0]) : null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const { rows } = await db.query("SELECT * FROM voz_users WHERE cpf = $1 LIMIT 1", [cpf]);
    return rows.length ? toUser(rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await db.query("SELECT * FROM voz_users WHERE id = $1 LIMIT 1", [id]);
    return rows.length ? toUser(rows[0]) : null;
  }

  async create(data: any): Promise<User> {
    const { rows } = await db.query(
      `INSERT INTO voz_users (name, email, cpf, birth_date, phone_number, avatar_url, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.name, data.email, data.cpf, data.birthDate, data.phoneNumber, data.avatarUrl, data.role, data.password]
    );
    return toUser(rows[0]);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined)        { fields.push(`name = $${idx++}`);         values.push(data.name); }
    if (data.phoneNumber !== undefined) { fields.push(`phone_number = $${idx++}`); values.push(data.phoneNumber); }
    if (data.avatarUrl !== undefined)   { fields.push(`avatar_url = $${idx++}`);   values.push(data.avatarUrl); }
    if (data.role !== undefined)        { fields.push(`role = $${idx++}`);          values.push(data.role); }

    if (fields.length === 0) return (await this.findById(id))!;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE voz_users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return toUser(rows[0]);
  }

  async updateRefreshToken(_userId: string, _refreshToken: string): Promise<void> {
    // Stateless JWT — no-op
  }

  async savePushSubscription(userId: string, subscription: any): Promise<void> {
    await db.query(
      "UPDATE voz_users SET push_subscriptions = COALESCE(push_subscriptions, '[]'::jsonb) || $1::jsonb WHERE id = $2",
      [JSON.stringify([subscription]), userId]
    );
  }

  async removePushSubscription(userId: string, endpoint: string): Promise<void> {
    await db.query(
      "UPDATE voz_users SET push_subscriptions = (SELECT jsonb_agg(sub) FROM jsonb_array_elements(push_subscriptions) sub WHERE sub->>'endpoint' != $1) WHERE id = $2",
      [endpoint, userId]
    );
  }

  async updateNotificationSettings(userId: string, settings: any): Promise<void> {
    await db.query(
      "UPDATE voz_users SET notification_settings = $1 WHERE id = $2",
      [JSON.stringify(settings), userId]
    );
  }
}
