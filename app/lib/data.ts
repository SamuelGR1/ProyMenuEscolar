import { sql } from '@vercel/postgres';
import {
  productos,
  ProductsForm,
  clientes,
  configuracion_menus,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoiceFormclientes,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  categorias,
  subcategorias,
  menus,
  CustomerFieldmenudia,
} from './definitions';
import { formatCurrency } from './utils'; 
export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

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
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
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
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

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

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
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

//actualizar.


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
  m.id_menu,
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



export async function  fetchSubmenus() {
  try {
    const data = await sql<menus>`
      SELECT  
        descripcion_menu,
        id_menu,
    
      FROM menus
      ORDER BY descripcion_menu ASC
    `;

    const menus = data.rows;
    return menus;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all menus.');
  }
}






//FIN fernanda-------------------------------------------------------------------------

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
