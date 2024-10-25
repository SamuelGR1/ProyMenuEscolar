import { sql } from '@vercel/postgres';
import {
  clientes,
  configuracion_menus,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoiceFormclientes,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils'; 


export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredClientes(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await sql<clientes>`
  SELECT
  clientes.id_cliente,
    clientes.nombre_cliente,
    clientes.telefono_cliente,
    clientes.direccion_cliente,
    clientes.fecha_registro
  FROM clientes
  WHERE
    clientes.nombre_cliente ILIKE ${'%' + query + '%'}
    OR clientes.direccion_cliente ILIKE ${'%' + query + '%'}
    OR clientes.telefono_cliente ILIKE ${'%' + query + '%'}
    OR TO_CHAR(clientes.fecha_registro, 'Mon DD, YYYY') ILIKE ${'%' + query + '%'} 
 ORDER BY clientes.fecha_registro DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
`;



    return client.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clientes.');
  }
}


export async function fetchClienteById(id: string): Promise<clientes | null> {
  
  try {
    const data = await sql<clientes>`
      SELECT
      clientes.id_cliente,
        clientes.nombre_cliente,
        clientes.telefono_cliente,
        clientes.direccion_cliente,
        clientes.fecha_registro
      FROM clientes
      WHERE clientes.id_cliente = ${id}; 
    `;

    if (data.rows.length === 0) {
      console.log('No se encontró ningún cliente con el ID proporcionado.');
      return null; // Maneja el caso en que no se encuentra el cliente
    }

    // Retorna el primer cliente si existe
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cliente.');
  }
}



export async function fetchFilteredMenudia(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await sql<configuracion_menus>` 
      SELECT 
          c.id_cliente,
          c.nombre_cliente,
          c.telefono_cliente,
          c.direccion_cliente,
          cm.id_configuracion,
          cm.menu_id,
          cm.dia_semana,
          cm.fecha_configuracion,
          m.descripcion_menu,
          m.costo_total
      FROM 
          clientes c
      JOIN 
          configuracion_menus cm ON c.id_cliente = cm.cliente_id
      JOIN 
          menus m ON cm.menu_id = m.id_menu
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};  -- Si necesitas paginación
    `;

    return client.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clientes.');
  }
}
