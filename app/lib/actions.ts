'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 

const FormSchema1 = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),

  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

  const CreateInvoice = FormSchema1.omit({ id: true, date: true });
  const UpdateInvoice = FormSchema1.omit({ id: true, date: true });

  export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };


  

  export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
   
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
   
    // Insert data into the database
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
   
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
  ) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }


export async function deleteInvoice(id: string) {


  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
  


// Esquema de validación con Zod
const FormSchema = z.object({
  descripcion_producto: z.string().min(1, {
    message: 'La descripción del producto es obligatoria.',
  }),
  precio_costo: z
    .preprocess((val) => Number(val), z.number().positive({ message: 'El precio debe ser mayor que 0.' })),
  precio_unitario: z
    .preprocess((val) => Number(val), z.number().positive({ message: 'El precio unitario debe ser mayor que 0.' })),
  categoria_id: z.string().min(1, { message: 'La categoría es obligatoria.' }),
  subcategoria_id: z.string().min(1, { message: 'La subcategoría es obligatoria.' }),
});

// Función para obtener el ID de categoría según su descripción
async function getCategoriaIdByDescripcion(descripcion: string): Promise<number | null> {
  const result = await sql`
    SELECT id_categoria FROM categorias WHERE descripcion_categoria = ${descripcion} LIMIT 1;
  `;
  return result.rowCount > 0 ? result.rows[0].id_categoria : null;
}

// Función para obtener el ID de subcategoría según su descripción
async function getSubcategoriaIdByDescripcion(descripcion: string): Promise<number | null> {
  const result = await sql`
    SELECT id_subcategoria FROM subcategorias WHERE descripcion_subcategoria = ${descripcion} LIMIT 1;
  `;
  return result.rowCount > 0 ? result.rows[0].id_subcategoria : null;
}





// Función para crear un producto
export async function createProduct(formData: FormData) {
  // Validar los datos usando Zod
  const validatedFields = FormSchema.safeParse({
    descripcion_producto: formData.get('descripcion_producto'),
    precio_costo: formData.get('precio_costo'),
    precio_unitario: formData.get('precio_unitario'),
    categoria_id: formData.get('categoria_id'), // Cambiado a ID
    subcategoria_id: formData.get('subcategoria_id'), // Cambiado a ID
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos obligatorios o son inválidos.',
    };
  }

  const {
    descripcion_producto,
    precio_costo,
    precio_unitario,
    categoria_id,
    subcategoria_id,
  } = validatedFields.data;

  // Obtener los IDs de categoría y subcategoría
  const categoriaId = await getCategoriaIdByDescripcion(categoria_id);
  const subcategoriaId = await getSubcategoriaIdByDescripcion(subcategoria_id);

  if (!categoriaId || !subcategoriaId) {
    return { message: 'Categoría o subcategoría no encontrada.' };
  }

  try {
    // Insertar el nuevo producto en la base de datos
    await sql`
      INSERT INTO productos (descripcion_producto, precio_costo, precio_unitario, categoria_id, subcategoria_id)
      VALUES (${descripcion_producto}, ${precio_costo}, ${precio_unitario}, ${categoriaId}, ${subcategoriaId});
    `;

    revalidatePath('/dashboard/vistaProductos'); // Revalidar la caché
    redirect('/dashboard/vistaProductos'); // Redirigir al usuario
    return { message: 'Producto creado con éxito.' };
  } catch (error) {
    console.error('Error al insertar producto:', error);
    return { message: 'Error en la base de datos: No se pudo crear el producto.' };
  }
}