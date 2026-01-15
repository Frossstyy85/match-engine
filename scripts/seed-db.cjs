
/**
 * Seed script for local Postgres (docker-compose).
 *
 * Usage:
 *   npm run seed
 *   npm run seed --reset
 *   node scripts/seed-db.cjs
 *   node scripts/seed-db.cjs --reset
 *
 */

const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

function pickManyUnique(arr, n, rand) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const shouldReset = args.has("--reset");

  const seed = Number(process.env.SEED ?? 42);
  const rand = mulberry32(Number.isFinite(seed) ? seed : 42);

  const pool = new Pool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "app_db",
    user: process.env.DB_USER ?? "app_user",
    password: process.env.DB_PASSWORD ?? "app_password",
    max: 5,
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Ensure schema exists (since docker-compose no longer runs initdb scripts).
    // We only apply schema.sql when the core tables aren't present.
    const { rows: regRows } = await client.query(
      "SELECT to_regclass('public.users') AS users_table;"
    );
    const hasUsersTable = Boolean(regRows?.[0]?.users_table);
    if (!hasUsersTable) {
      const schemaPath = path.join(process.cwd(), "db", "schema.sql");
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      await client.query(schemaSql);
    }

    if (shouldReset) {
      // Order doesn't matter with CASCADE, but keeping join tables first is clearer.
      await client.query(`
        TRUNCATE
          user_skills,
          user_roles,
          team_users,
          project_teams,
          users,
          teams,
          projects,
          roles,
          skills
        RESTART IDENTITY CASCADE;
      `);
    }

    const SKILLS = [
      "Python",
      "Java",
      "JavaScript",
      "SQL",
      "C++",
      "C#",
      "Go",
      "Rust",
      "HTML",
      "CSS",
      "React",
      "Node.js",
      "Django",
      "Flask",
      "Spring Boot",
      "Docker",
      "Kubernetes",
      "Git",
      "Linux",
      "AWS",
    ];

    const ROLES = ["USER", "ADMIN", "HR", "PROJECT_LEAD"];

    const TEAMS = [
      "Platform",
      "Delivery",
      "Data",
      "Frontend",
      "Backend",
      "DevOps",
      "QA",
      "Operations",
    ];

    const PROJECTS = [
      { name: "Engine Rewrite", status: "COMPLETED" },
      { name: "Customer Portal", status: "IN_PROGRESS" },
      { name: "Skills Matrix v2", status: "IN_PROGRESS" },
      { name: "Staffing Dashboard", status: "IN_PROGRESS" },
      { name: "Auth Hardening", status: "IN_PROGRESS" },
      { name: "GraphQL Consolidation", status: "IN_PROGRESS" },
      { name: "Reporting Pipeline", status: "IN_PROGRESS" },
      { name: "Onboarding Flow", status: "COMPLETED" },
      { name: "Search + Filtering", status: "IN_PROGRESS" },
      { name: "Design System", status: "IN_PROGRESS" },
      { name: "Role Management", status: "IN_PROGRESS" },
      { name: "Team Allocation", status: "IN_PROGRESS" },
    ];


    await client.query(
      `INSERT INTO skills (name)
       SELECT UNNEST($1::text[])
       ON CONFLICT (name) DO NOTHING;`,
      [SKILLS]
    );

    await client.query(
      `INSERT INTO roles (name)
       SELECT UNNEST($1::text[])
       ON CONFLICT (name) DO NOTHING;`,
      [ROLES]
    );

    await client.query(
      `
      INSERT INTO teams (name)
      SELECT t.name
      FROM UNNEST($1::text[]) AS t(name)
      WHERE NOT EXISTS (SELECT 1 FROM teams existing WHERE existing.name = t.name);
      `,
      [TEAMS]
    );

    for (const p of PROJECTS) {
      await client.query(
        `INSERT INTO projects (name, project_status)
         SELECT $1::varchar, $2::project_status
         WHERE NOT EXISTS (SELECT 1 FROM projects existing WHERE existing.name = $1::varchar);`,
        [p.name, p.status]
      );
    }
    const FIRST = [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Emma",
      "Frank",
      "Grace",
      "Henry",
      "Ivy",
      "Jack",
      "Kate",
      "Liam",
      "Mia",
      "Noah",
      "Olivia",
      "Paul",
      "Quinn",
      "Ruby",
      "Sophia",
      "Thomas",
      "Uma",
      "Victor",
      "Wendy",
      "Xavier",
      "Yara",
      "Zoe",
    ];
    const LAST = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
      "Rodriguez",
      "Wilson",
      "Martinez",
      "Anderson",
      "Taylor",
      "Thomas",
      "Moore",
      "Jackson",
    ];

    const userCount = 30;
    const rawPassword = "password";
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    const usersToInsert = [];
    for (let i = 1; i <= userCount; i++) {
      const first = pickOne(FIRST, rand);
      const last = pickOne(LAST, rand);
      const name = `${first} ${last}`;
      const email = `user${String(i).padStart(2, "0")}@example.com`;
      usersToInsert.push({ email, name });
    }

    for (const u of usersToInsert) {
      await client.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING;`,
        [u.email, u.name, passwordHash]
      );
    }

    // Fetch ids for mapping
    const { rows: userRows } = await client.query(
      `SELECT id, email FROM users WHERE email = ANY($1::text[]) ORDER BY id ASC;`,
      [usersToInsert.map((u) => u.email)]
    );
    const userIdByEmail = new Map(userRows.map((r) => [r.email, r.id]));

    const { rows: roleRows } = await client.query(`SELECT id, name FROM roles;`);
    const roleIdByName = new Map(roleRows.map((r) => [r.name, r.id]));

    const { rows: teamRows } = await client.query(`SELECT id, name FROM teams;`);
    const teamIdByName = new Map(teamRows.map((r) => [r.name, r.id]));

    const { rows: projectRows } = await client.query(`SELECT id, name FROM projects;`);
    const projectIdByName = new Map(projectRows.map((r) => [r.name, r.id]));

    const { rows: skillRows } = await client.query(`SELECT id, name FROM skills;`);
    const skillIdByName = new Map(skillRows.map((r) => [r.name, r.id]));
    const special = shuffle(usersToInsert.map((u) => u.email), rand);
    const admins = new Set(special.slice(0, 3));
    const hrs = new Set(special.slice(3, 5));
    const pls = new Set(special.slice(5, 8));

    for (const u of usersToInsert) {
      const userId = userIdByEmail.get(u.email);
      if (!userId) continue;

      const roles = new Set(["USER"]);
      if (admins.has(u.email)) roles.add("ADMIN");
      if (hrs.has(u.email)) roles.add("HR");
      if (pls.has(u.email)) roles.add("PROJECT_LEAD");

      for (const r of roles) {
        const roleId = roleIdByName.get(r);
        if (!roleId) continue;
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
          [userId, roleId]
        );
      }
    }

    for (let i = 0; i < usersToInsert.length; i++) {
      const email = usersToInsert[i].email;
      const userId = userIdByEmail.get(email);
      if (!userId) continue;

      const baseTeam = TEAMS[i % TEAMS.length];
      const extraTeam = rand() < 0.45 ? pickOne(TEAMS, rand) : null;
      const chosenTeams = new Set([baseTeam]);
      if (extraTeam) chosenTeams.add(extraTeam);

      for (const tName of chosenTeams) {
        const teamId = teamIdByName.get(tName);
        if (!teamId) continue;
        await client.query(
          `INSERT INTO team_users (team_id, user_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
          [teamId, userId]
        );
      }
    }

    for (const p of PROJECTS) {
      const projectId = projectIdByName.get(p.name);
      if (!projectId) continue;

      const teamCount = rand() < 0.6 ? 2 : 3;
      const chosen = pickManyUnique(TEAMS, teamCount, rand);
      for (const tName of chosen) {
        const teamId = teamIdByName.get(tName);
        if (!teamId) continue;
        await client.query(
          `INSERT INTO project_teams (project_id, team_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
          [projectId, teamId]
        );
      }
    }

    // 6) Assign skills to users (5–9 skills each, with levels 0–3)
    for (const u of usersToInsert) {
      const userId = userIdByEmail.get(u.email);
      if (!userId) continue;

      const skillCount = 5 + Math.floor(rand() * 5); // 5..9
      const chosenSkills = pickManyUnique(SKILLS, skillCount, rand);
      for (const sName of chosenSkills) {
        const skillId = skillIdByName.get(sName);
        if (!skillId) continue;
        const level = Math.floor(rand() * 4); // 0..3
        await client.query(
          `INSERT INTO user_skills (user_id, skill_id, skill_level)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, skill_id) DO UPDATE SET skill_level = EXCLUDED.skill_level;`,
          [userId, skillId, level]
        );
      }
    }

    await client.query("COMMIT");

    console.log("Seed complete.");
    console.log(`- Users inserted/ensured: ${usersToInsert.length} (password="${rawPassword}")`);
    console.log(`- Teams ensured: ${TEAMS.length}`);
    console.log(`- Projects ensured: ${PROJECTS.length}`);
    console.log(`- Roles ensured: ${ROLES.join(", ")}`);
    console.log(`- Seed: ${seed}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

