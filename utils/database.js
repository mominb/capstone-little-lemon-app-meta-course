import * as SQLite from "expo-sqlite";

let db;

async function initDB() {
   if (!db) {
      db = await SQLite.openDatabaseAsync("little_lemon-v2");
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

    CREATE TABLE IF NOT EXISTS cartitems (
      item_id INTEGER PRIMARY KEY,
      amount INTEGER NOT NULL,
      FOREIGN KEY (item_id) REFERENCES menuitems(id)
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
            item.category,
         );
      }

      await database.execAsync("COMMIT;");
      console.log("Menu items saved successfully.");
   } catch (err) {
      await database.execAsync("ROLLBACK;");
      console.error("Insert failed:", err);
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

export async function filterByQueryAndCategories(
   searchTerm,
   selectedCategories,
) {
   const database = await initDB();
   const whereStatement = [];
   const values = [];

   if (searchTerm) {
      whereStatement.push("name LIKE ?");
      values.push(`%${searchTerm}%`);
   }
   if (selectedCategories.length > 0) {
      whereStatement.push(
         `category IN (${selectedCategories.map(() => "?").join(",")})`,
      );
      values.push(...selectedCategories);
   }

   let where = "";

   if (whereStatement.length > 0) {
      where = `WHERE ${whereStatement.join(" AND ")}`;
   }

   const sql = `SELECT * FROM menuitems ${where}`;

   return await database.getAllAsync(sql, values);
}

export async function getMenuItemsInCart() {
   const database = await initDB();
   const cartItems = await database.getAllAsync(`
    SELECT
      cartitems.item_id,
      cartitems.amount,
      menuitems.name,
      menuitems.price,
      menuitems.description,
      menuitems.image,
      menuitems.category
    FROM cartitems
      JOIN menuitems ON cartitems.item_id = menuitems.id
  `);
   return cartItems;
}

export async function getCategoriesfromDB() {
   const database = await initDB();
   const menu = await database.getAllAsync("SELECT * FROM menuitems");
   const categories = [];
   menu.forEach((item) => {
      if (!categories.includes(item.category)) {
         categories.push(item.category);
      }
   });
   return categories;
}

export async function isMenuPopulated() {
   const database = await initDB();
   const rows = await database.getAllAsync("SELECT * FROM menuitems");
   return rows.length > 0;
}

export async function saveItemToCart(item_id, amount) {
   const database = await initDB();

   try {
      await database.execAsync("BEGIN TRANSACTION;");
      const sql = `
  INSERT INTO cartitems (item_id, amount)
  VALUES (?, ?)
  ON CONFLICT (item_id) DO UPDATE SET
  amount = amount + excluded.amount
  `;
      await database.runAsync(sql, item_id, amount);
      await database.execAsync("COMMIT;");
      return { type: "success", message: "Item added to cart" };
   } catch (e) {
      console.log("Add to cart failed: ", e);
      await database.execAsync("ROLLBACK;");
      return { type: "error", message: "Failed to add item" };
   }
}

export async function deleteCartItem(item_id) {
   const database = await initDB();
   try {
      await database.execAsync("BEGIN TRANSACTION;");
      const sql = `
      DELETE FROM cartitems
      WHERE item_id = ?;
      `;
      await database.runAsync(sql, item_id);
      await database.execAsync("COMMIT;");
      return { type: "success", message: "Item deleted from cart" };
   } catch (e) {
      console.log("Deletion from cart failed: ", e);
      await database.execAsync("ROLLBACK;");
      return { type: "error", message: "Failed to delete item" };
   }
}

export async function cartItemCount() {
   const database = await initDB();
   const cartItems = await database.getAllAsync("SELECT * FROM cartitems");
   return cartItems.length;
}
