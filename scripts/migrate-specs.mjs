import { createConnection } from 'mariadb';

const conn = await createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'cozmictech_v2'
});

try {
  // 1. Add specifications_json column (safe - additive)
  await conn.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS specifications_json LONGTEXT NULL AFTER height');
  console.log('✓ Added specifications_json column');

  // 2. Insert missing sectors
  await conn.query(`INSERT INTO sectors (name, created_at, updated_at)
    SELECT 'Jetties & Marine Infrastructure', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Jetties & Marine Infrastructure')`);
  await conn.query(`INSERT INTO sectors (name, created_at, updated_at)
    SELECT 'Power Transmission & Distribution', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Power Transmission & Distribution')`);
  console.log('✓ Inserted missing sectors');

  // Helper: clean a raw DB value (treat empty / N/A as null)
  const clean = (v) => (v && String(v).trim() && String(v).trim().toLowerCase() !== 'n/a') ? String(v).trim() : null;

  // 3. Backfill Building projects (sector_id = 3)
  const buildingProjects = await conn.query(
    'SELECT id, area, height, feature, story FROM projects WHERE sector_id = 3'
  );
  for (const p of buildingProjects) {
    const spec = {};
    if (clean(p.area))    spec.gross_floor_area = clean(p.area);
    if (clean(p.height))  spec.building_height  = clean(p.height);
    if (clean(p.story))   spec.floors_basement  = clean(p.story);
    if (clean(p.feature)) spec.other_details    = clean(p.feature);
    await conn.query('UPDATE projects SET specifications_json = ? WHERE id = ?',
      [JSON.stringify(spec), p.id]);
    console.log(`  Building project ${p.id} -> ${JSON.stringify(spec)}`);
  }

  // 4. Backfill Power & Energy projects (sector_id = 8)
  const powerProjects = await conn.query(
    'SELECT id, area, height, feature, story FROM projects WHERE sector_id = 8'
  );
  for (const p of powerProjects) {
    const spec = {};
    if (clean(p.feature)) spec.other_details = clean(p.feature);
    await conn.query('UPDATE projects SET specifications_json = ? WHERE id = ?',
      [JSON.stringify(spec), p.id]);
    console.log(`  Power project ${p.id} -> ${JSON.stringify(spec)}`);
  }

  // 5. Verify JSON is valid for all rows
  const rows = await conn.query('SELECT id, specifications_json FROM projects');
  let allOk = true;
  for (const r of rows) {
    if (r.specifications_json) {
      try { JSON.parse(r.specifications_json); }
      catch (e) { console.error(`INVALID JSON for project id=${r.id}`); allOk = false; }
    }
  }
  console.log(`✓ All JSON valid: ${allOk}`);

  // 6. Show final sector list
  const sectors = await conn.query('SELECT id, name FROM sectors ORDER BY id');
  console.log('✓ Sectors:', sectors.map(s => `[${s.id}] ${s.name}`).join(', '));

  // 7. Drop old columns
  await conn.query('ALTER TABLE projects DROP COLUMN IF EXISTS feature');
  await conn.query('ALTER TABLE projects DROP COLUMN IF EXISTS story');
  await conn.query('ALTER TABLE projects DROP COLUMN IF EXISTS area');
  await conn.query('ALTER TABLE projects DROP COLUMN IF EXISTS height');
  console.log('✓ Dropped old columns: feature, story, area, height');

  // 8. Final column check
  const cols = await conn.query('DESCRIBE projects');
  console.log('✓ Final project columns:', cols.map(c => c.Field).join(', '));

} finally {
  await conn.end();
}
