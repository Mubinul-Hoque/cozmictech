// Migrate specifications_json from {key: value} object format
// to [{title, value}] array format, using human-readable titles
// derived from the old sectorSpecs schema.

import { createConnection } from 'mariadb';

// Human-readable label map (from the old schema)
const LABEL_MAP = {
  // Building
  gross_floor_area: 'Gross Floor Area',
  building_height: 'Building Height',
  floors_basement: 'Floors / Basement Configuration',
  building_type: 'Building Type',
  structural_system: 'Structural System',
  architectural_scope: 'Architectural Scope',
  structural_scope: 'Structural Scope',
  mep_systems: 'MEP Systems',
  green_building: 'Green Building / Sustainability Features',
  site_development: 'Site Development',
  infrastructure_components: 'Infrastructure Components',
  // Power & Energy
  plant_type: 'Plant Type',
  generation_capacity: 'Generation Capacity (MW)',
  fuel_type: 'Fuel Type',
  number_of_units: 'Number of Units',
  generation_technology: 'Generation Technology',
  substation_switchyard: 'Substation / Switchyard',
  major_equipment: 'Major Equipment',
  epc_scope: 'EPC / Consultancy Scope',
  grid_connection: 'Grid Connection',
  // Fallback
  other_details: 'Other Relevant Details',
};

const conn = await createConnection({
  host: '127.0.0.1', port: 3306,
  user: 'root', password: '',
  database: 'cozmictech_v2'
});

try {
  const rows = await conn.query('SELECT id, specifications_json FROM projects');
  let converted = 0;

  for (const row of rows) {
    if (!row.specifications_json) continue;

    let parsed;
    try { parsed = JSON.parse(row.specifications_json); }
    catch { console.warn(`  Skipping id=${row.id}: invalid JSON`); continue; }

    // Already an array — skip (idempotent)
    if (Array.isArray(parsed)) {
      console.log(`  id=${row.id}: already array, skipping`);
      continue;
    }

    // Convert object {key: val} → [{title, value}]
    const arr = Object.entries(parsed)
      .filter(([, v]) => v !== null && String(v).trim() !== '')
      .map(([k, v]) => ({
        title: LABEL_MAP[k] ?? k,   // fallback: use key itself if not in map
        value: String(v).trim()
      }));

    await conn.query(
      'UPDATE projects SET specifications_json = ? WHERE id = ?',
      [JSON.stringify(arr), row.id]
    );
    console.log(`  id=${row.id}: ${JSON.stringify(arr)}`);
    converted++;
  }

  console.log(`\n✓ Converted ${converted} rows to array format`);

  // Spot-check
  const sample = await conn.query('SELECT id, specifications_json FROM projects WHERE id IN (1, 17) ORDER BY id');
  for (const r of sample) {
    console.log(`\nid=${r.id}:`, r.specifications_json);
  }
} finally {
  await conn.end();
}
