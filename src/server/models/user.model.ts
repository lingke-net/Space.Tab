import { mysqlConnection } from "../config/database"

export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    is_banned: boolean,
    ban_reason?: string | null,
    ban_expiration?: Date | null,
    is_admin: boolean,
    created_at: Date,
    updated_at?: Date,
    last_login?: Date,
    avatar?: string,
    qq_num?: string,
    email_verified?: boolean,
}

export const findUserById = async (userId: number): Promise<User | null> => {
    const [rows] = await mysqlConnection.query(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [userId]
    );
    return (rows as User[])[0] || null;
};
  
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await mysqlConnection.query(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
    );
    return (rows as User[])[0] || null;
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const [result] = await mysqlConnection.execute(
        `INSERT INTO users (
        username,
        email,
        password,
        is_banned,
        ban_reason,
        ban_expiration,
        is_admin,
        qq_num,
        email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user.username,
            user.email,
            user.password,
            user.is_banned ? 1 : 0,
            user.ban_reason || null,
            user.ban_expiration || null,
            user.is_admin ? 1 : 0,
            user.qq_num || null,
            user.email_verified || 0,
        ]
    );
    return result;
}

export const updateUser = async (user: User) => {
    const [result] = await mysqlConnection.execute(
        `UPDATE users SET
        username = ?,
        email = ?,
        is_banned = ?,
        ban_reason = ?,
        ban_expiration = ?,
        is_admin = ?,
        updated_at = NOW(),
        avatar = ?,
        qq_num = ?,
        email_verified = ?
        WHERE id = ?`,
        [
            user.username,
            user.email,
            user.is_banned ? 1 : 0,
            user.ban_reason || null,
            user.ban_expiration || null,
            user.is_admin ? 1 : 0,
            user.avatar || null,
            user.qq_num || null,
            user.email_verified || 0,
            user.id
        ]
    );
    return result;
}

export const deleteUserById = async (userId: number) => {
    const [result] = await mysqlConnection.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
    );
    return result;
};

export const updateUserPassword = async (userId: number, newPassword: string) => {
    const [result] = await mysqlConnection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, userId]
    );
    return result;
}

export const findUserByPage = async (pageNum: number, pageSize: number) => {
    const [rows] = await mysqlConnection.query(
        'SELECT id, username, email, is_banned, ban_reason, ban_expiration, is_admin, created_at, updated_at, last_login, avatar, qq_num, email_verified FROM users LIMIT ?, ?',
        [(pageNum - 1) * pageSize, pageSize]
    );
    return rows as User[];
}

export const updateLastLogin = async (userId: number) => {
    const [result] = await mysqlConnection.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [userId]
    );
    return result;
}

export const getUserCount = async () => {
    const [rows] = await mysqlConnection.query('SELECT COUNT(*) as count FROM users');
    return (rows as any)[0].count;
}