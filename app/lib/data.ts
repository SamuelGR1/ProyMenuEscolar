import { sql } from '@vercel/postgres';
import {
  productos,
  ProductsForm,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  categorias,
  subcategorias,
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

export async function fetchInvoiceById(id: string) {
  
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    
    console.log(invoice); // Invoice is an empty array []
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
        id,
        name
      FROM customers
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
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
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


//-------------------------------------------------------------------------

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredproductos(
  query: string,  
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const product = await sql<productos>
    ` SELECT
        productos.id_producto,
        productos.descripcion_producto,
        productos.precio_costo,
        productos.precio_unitario,
        categorias.descripcion_categoria,
        subcategorias.descripcion_subcategoria,
        productos.fecha_modificacion

      FROM productos

      JOIN categorias ON productos.categoria_id = categorias.id_categoria
      JOIN subcategorias ON productos.subcategoria_id = subcategorias.id_subcategoria

      WHERE

          productos.descripcion_producto ILIKE ${`%${query}%`} OR
          categorias.descripcion_categoria ILIKE ${`%${query}%`} OR
          subcategorias.descripcion_subcategoria ILIKE ${`%${query}%`} OR
          TO_CHAR(productos.fecha_modificacion, 'Mon DD, YYYY') ILIKE ${'%' + query + '%'}
 
      ORDER BY productos.fecha_modificacion ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return product.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}



export async function fetchCategorias() {
  try {
    const data = await sql<categorias>`
      SELECT
        id_categoria,
        descripcion_categoria
      FROM categorias
      ORDER BY descripcion_categoria ASC
    `;

    const categories = data.rows;
    return categories;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all categories.');
  }
}


export async function  fetchSubcategorias() {
  try {
    const data = await sql<subcategorias>`
      SELECT  
        id_subcategoria,
        descripcion_subcategoria,
        categoria_id
      FROM subcategorias
      ORDER BY descripcion_subcategoria ASC
    `;

    const categories = data.rows;
    return categories;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all categories.');
  }
}


export async function fetchProductoById(id: string) {
  
  try {
    const data = await sql<ProductsForm>`
      SELECT
      productos.id_producto,
        productos.descripcion_producto,
        productos.precio_costo,
        productos.precio_unitario,
        categorias.descripcion_categoria,
        subcategorias.descripcion_subcategoria  
      FROM productos
      JOIN categorias ON productos.categoria_id = categorias.id_categoria
      JOIN subcategorias ON productos.subcategoria_id = subcategorias.id_subcategoria
      WHERE productos.id_producto = ${id};

    `;

    console.log('Data from query:', data);  // Verifica si la consulta devuelve datos


    const product = data.rows.map((product) => ({
      ...product,
      // Convert amount from cents to dollars
      precio_costo: product.precio_costo / 100,
      precio_unitario: product.precio_unitario / 100,
    }));
    
    console.log(product); // Invoice is an empty array []
    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product. fetchProductoById-data.ts');
  }
}
