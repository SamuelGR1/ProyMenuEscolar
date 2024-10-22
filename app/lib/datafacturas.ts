import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils'; 

export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT SUM(total_factura) AS total FROM facturas`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>` 
      SELECT f.total_factura AS amount, c.name, c.image_url, c.email, f.id_factura AS id
      FROM facturas f
      JOIN clientes c ON f.cliente_id = c.id_cliente
      ORDER BY f.fecha_factura DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM facturas`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM clientes`;
    const invoiceStatusPromise = sql`
      SELECT
        SUM(CASE WHEN f.status = 'paid' THEN f.total_factura ELSE 0 END) AS "paid",
        SUM(CASE WHEN f.status = 'pending' THEN f.total_factura ELSE 0 END) AS "pending"
      FROM facturas f`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>` 
      SELECT
        f.id_factura AS id,
        f.total_factura AS amount,
        f.fecha_factura AS date,
        f.status,
        c.name,
        c.email,
        c.image_url
      FROM facturas f
      JOIN clientes c ON f.cliente_id = c.id_cliente
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        c.email ILIKE ${`%${query}%`} OR
        f.total_factura::text ILIKE ${`%${query}%`} OR
        f.fecha_factura::text ILIKE ${`%${query}%`} OR
        f.status ILIKE ${`%${query}%`}
      ORDER BY f.fecha_factura DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
      FROM facturas f
      JOIN clientes c ON f.cliente_id = c.id_cliente
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        c.email ILIKE ${`%${query}%`} OR
        f.total_factura::text ILIKE ${`%${query}%`} OR
        f.fecha_factura::text ILIKE ${`%${query}%`} OR
        f.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>` 
      SELECT
        f.id_factura AS id,
        f.cliente_id AS customer_id,
        f.total_factura AS amount,
        f.status
      FROM facturas f
      WHERE f.id_factura = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      amount: invoice.amount, // Amount already in dollars
    }));
    
    console.log(invoice); // Check for empty array
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>` 
      SELECT
        id_cliente AS id,
        name
      FROM clientes
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>` 
      SELECT
        c.id_cliente AS id,
        c.name,
        c.email,
        c.image_url,
        COUNT(f.id_factura) AS total_invoices,
        SUM(CASE WHEN f.status = 'pending' THEN f.total_factura ELSE 0 END) AS total_pending,
        SUM(CASE WHEN f.status = 'paid' THEN f.total_factura ELSE 0 END) AS total_paid
      FROM clientes c
      LEFT JOIN facturas f ON c.id_cliente = f.cliente_id
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        c.email ILIKE ${`%${query}%`}
      GROUP BY c.id_cliente, c.name, c.email, c.image_url
      ORDER BY c.name ASC
    `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}