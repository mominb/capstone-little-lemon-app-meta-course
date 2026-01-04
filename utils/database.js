import * as SQLite from 'expo-sqlite';
let db;

async function initDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('little_lemon');
  }
  return db;
}

export async function createTable() {
  const database = await initDB();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT,
      description TEXT,
      image TEXT,
      category TEXT,
      UNIQUE(name, category)
    );
  `);
}

export async function saveMenuItems(menuItems) {
  console.log("Saving menu items to database...");
  const database = await initDB();

  try {
    await database.execAsync("BEGIN TRANSACTION;");

    const sql = `
      INSERT INTO menuitems (name, price, description, image, category)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(name, category) DO UPDATE SET
        price = excluded.price,
        description = excluded.description,
        image = excluded.image;
    `;

    for (const item of menuItems) {
      await database.runAsync(
        sql,
        item.name,
        item.price,
        item.description,
        item.image,
        item.category
      );
    }

    await database.execAsync("COMMIT;");
    console.log("Menu items saved successfully.");
  } catch (err) {
    await database.execAsync("ROLLBACK;");
    console.error("Insert failed:", err);
  }

  try {
    const rows = await database.getAllAsync("SELECT * FROM menuitems");
  } catch (err) {
    console.error("Failed to read table:", err);
  }
}



export async function getMenuItems() {
  const database = await initDB();
  const rows = await database.getAllAsync("SELECT * FROM menuitems");
  return rows;
}



export async function clearMenuItems() {
  const database = await initDB();
  await database.execAsync("DELETE FROM menuitems;");
}

export async function filterByQueryAndCategories(query, activeCategories) {
  const database = await initDB();
  const whereStatement = [];
  const values = [];

  if (query) {
    whereStatement.push('name LIKE ?');
    values.push(`%${query}%`);
  }
  if (activeCategories.length > 0) {
    whereStatement.push(
      `category IN (${activeCategories.map(() => '?').join(',')})`
    );
    values.push(...activeCategories);
  }

 let where = '';

  if (whereStatement.length > 0) {
    where = `WHERE ${whereStatement.join(' AND ')}`;
  }


  const sql = `SELECT * FROM menuitems ${where}`;

  return await database.getAllAsync(sql, values);
}
