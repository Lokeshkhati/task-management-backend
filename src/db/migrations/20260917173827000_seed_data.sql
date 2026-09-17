-- Up Migration
-- Seed data for local development.
-- Everything inserted here is identifiable by the 'user%@example.com' email
-- pattern and the 'Project %' name pattern, so the down migration can remove
-- exactly what this migration added and nothing else.

-- ---------------------------------------------------------------------------
-- 20 users
-- ---------------------------------------------------------------------------
INSERT INTO
    users (email, full_name, password_hash)
SELECT
    format('user%s@example.com', i),
    (
        ARRAY[
            'Aarav Sharma',
            'Diya Patel',
            'Vihaan Reddy',
            'Ananya Iyer',
            'Arjun Nair',
            'Ishaan Gupta',
            'Saanvi Rao',
            'Kabir Menon',
            'Myra Joshi',
            'Reyansh Bose',
            'Aditi Verma',
            'Vivaan Kulkarni',
            'Riya Chawla',
            'Advait Pillai',
            'Kiara Sen',
            'Rohan Malhotra',
            'Navya Desai',
            'Dhruv Anand',
            'Tara Bhatt',
            'Kian Mathur'
        ]
    )[i],
    -- bcrypt hash of 'password123' - seed data only, never reuse this
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWeEz8urXQ8vQh8Qk3Z0Q1qWZa'
FROM
    generate_series(1, 20) AS i;

-- ---------------------------------------------------------------------------
-- One profile per seeded user (user_profiles.user_id is UNIQUE)
-- ---------------------------------------------------------------------------
INSERT INTO
    user_profiles (user_id, avatar_url, bio, phone)
SELECT
    u.id,
    format('https://i.pravatar.cc/150?u=%s', u.email),
    format('Seed profile for %s.', u.full_name),
    format(
        '+91-98%s',
        lpad(
            (row_number() OVER (ORDER BY u.email))::text,
            8,
            '0'
        )
    )
FROM
    users u
WHERE
    u.email LIKE 'user%@example.com';

-- ---------------------------------------------------------------------------
-- 25 projects, owners spread across the 20 seeded users
-- ---------------------------------------------------------------------------
WITH
    seeded_users AS (
        SELECT
            id,
            row_number() OVER (ORDER BY email) AS rn
        FROM
            users
        WHERE
            email LIKE 'user%@example.com'
    )
INSERT INTO
    projects (name, description, status, owner_id)
SELECT
    format('Project %s', p),
    format('Seed description for project %s.', p),
    (
        ARRAY[
            'active',
            'active',
            'active',
            'completed',
            'archived'
        ]::project_status[]
    )[1 + (p % 5)],
    (
        SELECT
            id
        FROM
            seeded_users
        WHERE
            rn = 1 + (p % 20)
    )
FROM
    generate_series(1, 25) AS p;

-- ---------------------------------------------------------------------------
-- 40-50 tasks per project: 40 + (project_index % 11) => 1116 rows total
-- ---------------------------------------------------------------------------
WITH
    seeded_users AS (
        SELECT
            id,
            row_number() OVER (ORDER BY email) AS rn
        FROM
            users
        WHERE
            email LIKE 'user%@example.com'
    ),
    seeded_projects AS (
        SELECT
            id,
            name,
            row_number() OVER (ORDER BY id) AS rn
        FROM
            projects
        WHERE
            name LIKE 'Project %'
    )
INSERT INTO
    tasks (
        project_id,
        title,
        description,
        priority,
        status,
        due_date,
        assigned_to
    )
SELECT
    pr.id,
    format('%s - Task %s', pr.name, t),
    format('Seed task %s belonging to %s.', t, pr.name),
    (
        ARRAY['low', 'medium', 'high', 'critical']::priority[]
    )[1 + ((pr.rn + t) % 4)],
    (
        ARRAY[
            'pending',
            'in_progress',
            'completed',
            'cancelled'
        ]::task_status[]
    )[1 + ((pr.rn * 2 + t) % 4)],
    CURRENT_DATE + ((t % 60) || ' days')::interval,
    -- roughly every 7th task is left unassigned
    CASE
        WHEN (pr.rn + t) % 7 = 0 THEN NULL
        ELSE (
            SELECT
                id
            FROM
                seeded_users
            WHERE
                rn = 1 + ((pr.rn * 3 + t) % 20)
        )
    END
FROM
    seeded_projects pr
    CROSS JOIN LATERAL generate_series(1, 40 + (pr.rn % 11)::int) AS t;

-- ---------------------------------------------------------------------------
-- Project members: each project owner, plus 5 more users per project.
-- ON CONFLICT covers the case where a generated member is already the owner,
-- since (project_id, user_id) is the composite primary key.
-- ---------------------------------------------------------------------------
INSERT INTO
    project_members (project_id, user_id, role)
SELECT
    p.id,
    p.owner_id,
    'owner'::member_role
FROM
    projects p
WHERE
    p.name LIKE 'Project %'
    AND p.owner_id IS NOT NULL
ON CONFLICT (project_id, user_id) DO NOTHING;

WITH
    seeded_users AS (
        SELECT
            id,
            row_number() OVER (ORDER BY email) AS rn
        FROM
            users
        WHERE
            email LIKE 'user%@example.com'
    ),
    seeded_projects AS (
        SELECT
            id,
            row_number() OVER (ORDER BY id) AS rn
        FROM
            projects
        WHERE
            name LIKE 'Project %'
    )
INSERT INTO
    project_members (project_id, user_id, role)
SELECT
    pr.id,
    su.id,
    (
        ARRAY[
            'admin',
            'member',
            'member',
            'member',
            'member'
        ]::member_role[]
    )[1 + (m % 5)]
FROM
    seeded_projects pr
    CROSS JOIN generate_series(1, 5) AS m
    JOIN seeded_users su ON su.rn = 1 + ((pr.rn * 3 + m) % 20)
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Down Migration
-- Delete in FK-safe order. projects.owner_id is ON DELETE RESTRICT, so every
-- seeded project must be gone before the seeded users can be removed.
DELETE FROM project_members
WHERE
    project_id IN (
        SELECT
            id
        FROM
            projects
        WHERE
            name LIKE 'Project %'
    );

DELETE FROM tasks
WHERE
    project_id IN (
        SELECT
            id
        FROM
            projects
        WHERE
            name LIKE 'Project %'
    );

DELETE FROM projects
WHERE
    name LIKE 'Project %';

DELETE FROM user_profiles
WHERE
    user_id IN (
        SELECT
            id
        FROM
            users
        WHERE
            email LIKE 'user%@example.com'
    );

DELETE FROM users
WHERE
    email LIKE 'user%@example.com';
