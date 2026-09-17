import { pool } from "../../db/pool.js";

export async function findAllUsers() {
  const result = await pool.query(`
    SELECT
      id,
      full_name,
      email,
      created_at
    FROM users
    ORDER BY id DESC
  `);

  return result.rows;
}

export async function findUserById(id: string) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      email,
      created_at
    FROM users
    WHERE id = $1
  `,
    [id]
  );

  return result.rows[0];
}
