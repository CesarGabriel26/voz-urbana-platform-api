export interface Message {
    id: string,
    user_id: string,
    type: string,
    title: string,
    message: string,
    read: boolean,
    created_at: Date,
    updated_at: Date,
    complaint_id: string
}