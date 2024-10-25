import { sql } from '@vercel/postgres';
import {
  MenuField,
  MenusTable,
  MenuForm,
} from './definitions'; // Asegúrate de que definitions tenga las nuevas definiciones
import { formatCurrency } from './utils'; 

const ITEMS_PER_PAGE = 6; // Definimos la constante ITEMS_PER_PAGE

export async function fetchMenus() {
  try {
    const data = await sql<MenuField>`SELECT * FROM menus`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch menus.');
  }
}

export async function fetchMenuById(id: string) {
  try {
    const data = await sql<MenuForm>`
      SELECT
        id_menu,
        descripcion_menu,
        costo_total,
        fecha_creacion
      FROM menus
      WHERE id_menu = ${id};
    `;

    const menu = data.rows.map((menu) => ({
      ...menu,
      costo_total: menu.costo_total.toFixed(2), // Formatear el costo a dos decimales
    }));
    
    console.log(menu); // Menú es un array vacío []
    return menu[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch menu.');
  }
}

export async function createMenu(menuData: MenuForm) {
  try {
    const { descripcion_menu, costo_total } = menuData;
    const result = await sql`INSERT INTO menus (descripcion_menu, costo_total) VALUES (${descripcion_menu}, ${costo_total}) RETURNING *`;
    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create menu.');
  }
}

export async function fetchFilteredMenus(query: string) {
  try {
    const data = await sql<MenusTable>`
      SELECT
        id_menu,
        descripcion_menu,
        costo_total,
        fecha_creacion
      FROM menus
      WHERE
        descripcion_menu ILIKE ${`%${query}%`}
      ORDER BY fecha_creacion DESC
      LIMIT ${ITEMS_PER_PAGE} -- Limitar resultados por página
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered menus.');
  }
}

export async function fetchMenusPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*) FROM menus WHERE descripcion_menu ILIKE ${`%${query}%`}`;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of menus.');
  }
}

