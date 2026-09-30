import mariadb from 'mariadb';

async function migrate() {
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'cozmictech_v2'
  });

  try {
    // 1. Check & Add column
    const cols = await conn.query("SHOW COLUMNS FROM projects LIKE 'services_json'");
    if (cols.length === 0) {
      await conn.query("ALTER TABLE projects ADD COLUMN services_json LONGTEXT NULL AFTER specifications_json");
      console.log("Added services_json column to projects table.");
    } else {
      console.log("services_json column already exists.");
    }

    // 2. Fetch all projects
    const rows = await conn.query("SELECT id, title, services_rendered, services_json FROM projects");
    console.log(`Found ${rows.length} projects to check.`);

    for (const row of rows) {
      if (!row.services_json && row.services_rendered) {
        // Parse legacy services text
        let raw = row.services_rendered.trim();
        // Replace <br> variants with newline
        raw = raw.replace(/<br\s*\/?>/gi, '\n');
        
        let items = [];
        if (raw.includes('\n')) {
          items = raw.split('\n');
        } else if (raw.includes(',')) {
          items = raw.split(',');
        } else {
          items = [raw];
        }

        const services = items
          .map(item => {
            let str = item.trim();
            // remove leading bullet points or dashes
            str = str.replace(/^[-*•–—\s]+/, '').trim();
            // remove HTML entities
            str = str.replace(/&amp;/g, '&');
            return str;
          })
          .filter(str => str.length > 0)
          .map(title => ({
            title,
            details: ''
          }));

        if (services.length > 0) {
          const jsonStr = JSON.stringify(services);
          await conn.query("UPDATE projects SET services_json = ? WHERE id = ?", [jsonStr, row.id]);
          console.log(`Project #${row.id} ("${row.title}"): Migrated ${services.length} services.`);
        }
      }
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await conn.end();
  }
}

migrate();
