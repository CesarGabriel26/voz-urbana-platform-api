import { IMessageRepository } from "../../../core/repositories/message-repository.interface";
import { Message } from "../../../core/models/message.model";
import { db } from "../db";

function toMessage(row: any): Message {
    return {
        id: row.id,
        user_id: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        read: row.read,
        created_at: row.created_at,
        updated_at: row.updated_at,
        complaint_id: row.complaint_id
    };
}

export class MessageRepository implements IMessageRepository {
    async create(data: Omit<Message, "id" | "created_at" | "updated_at">): Promise<Message> {
        const { rows } = await db.query(
            `INSERT INTO voz_messages (user_id, type, title, message, read, complaint_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                data.user_id, data.type, data.title, data.message, data.read, data.complaint_id
            ]
        );
        return toMessage(rows[0]);
    }

    async findByUserId(id: string): Promise<Message[]> {
        const { rows } = await db.query(
            `SELECT * FROM voz_messages WHERE user_id = $1 ORDER BY created_at DESC`,
            [id]
        );
        return rows.map(toMessage);
    }

    async findAll(filters?: any): Promise<Message[]> {
        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (filters?.user_id) { conditions.push(`user_id = $${idx++}`); values.push(filters.user_id); }
        if (filters?.type) { conditions.push(`type = $${idx++}`); values.push(filters.type); }
        if (filters?.read !== undefined) { conditions.push(`read = $${idx++}`); values.push(filters.read); }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const { rows } = await db.query(`SELECT * FROM voz_messages ${where} ORDER BY created_at DESC`, values);
        return rows.map(toMessage);
    }

    async update(id: string, data: Partial<Message>): Promise<Message> {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
        if (data.message !== undefined) { fields.push(`message = $${idx++}`); values.push(data.message); }
        if (data.read !== undefined) { fields.push(`read = $${idx++}`); values.push(data.read); }
        if (data.type !== undefined) { fields.push(`type = $${idx++}`); values.push(data.type); }

        if (fields.length === 0) {
            const { rows } = await db.query("SELECT * FROM voz_messages WHERE id = $1", [id]);
            return toMessage(rows[0]);
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const { rows } = await db.query(
            `UPDATE voz_messages SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
            values
        );
        return toMessage(rows[0]);
    }

    async delete(id: string): Promise<void> {
        await db.query(`DELETE FROM voz_messages WHERE id = $1`, [id]);
    }
}