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
  


/// Esquema de validación con Zod
const FormSchema = z.object({
  idproducto: z.string().optional(), 
  descripcionproducto: z.string().min(1, {
    message: 'La descripción del producto es obligatoria.',
  }),
  preciocosto: z
    .preprocess((val) => Number(val), z.number().positive({ message: 'El precio debe ser mayor que 0.' })),
  preciounitario: z
    .preprocess((val) => Number(val), z.number().positive({ message: 'El precio unitario debe ser mayor que 0.' })),
  categoriadescripcion: z.string().min(1, { message: 'La categoría es obligatoria.' }),
  subcategoriadescripcion: z.string().min(1, { message: 'La subcategoría es obligatoria.' }),
  fecha_modificacion: z.string().optional(), 
});


export type Stateprod = {
  errors?: {
    idproducto?: string[];
    descripcionproducto?: string[];
    preciocosto?: string[];
    preciounitario?: string[];
    categoriadescripcion?: string[];
    subcategoriadescripcion?: string[];
  };
  message?: string | null;
};

// async function getCategoriaIdByDescripcion(descripcion: string): Promise<number | null> {
//   const result = await sql`
//     SELECT id_categoria 
//     FROM categorias 
//     WHERE TRIM(LOWER(descripcion_categoria)) = TRIM(LOWER(${descripcion})) 
//     LIMIT 1;
//   `;
//   return result.rowCount > 0 ? result.rows[0].id_categoria : null;
// }

// async function getSubcategoriaIdByDescripcion(descripcion: string): Promise<number | null> {
//   const result = await sql`
//     SELECT id_subcategoria 
//     FROM subcategorias 
//     WHERE TRIM(LOWER(descripcion_subcategoria)) = TRIM(LOWER(${descripcion})) 
//     LIMIT 1;
//   `;
//   return result.rowCount > 0 ? result.rows[0].id_subcategoria : null;
// }



// Función para crear un producto
export async function createProduct(prevState: Stateprod, formData: FormData) {
  // Validar los datos usando Zod
  const validatedFields = FormSchema.safeParse({
    descripcionproducto: formData.get('descripcionproducto'),
    preciocosto: formData.get('preciocosto'),
    preciounitario: formData.get('preciounitario'),
    categoriadescripcion: formData.get('categoriadescripcion'), // Cambiado a descripción
    subcategoriadescripcion: formData.get('subcategoriadescripcion'), // Cambiado a descripción
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos obligatorios o son inválidos.',
    };
  }


  const {
    descripcionproducto,
    preciocosto,
    preciounitario,
    categoriadescripcion, // Descripción
    subcategoriadescripcion, // Descripción
  } = validatedFields.data;

  const preciocostocent = preciocosto * 100;
  const preciounitariocent = preciounitario * 100;


  // Obtener los IDs de categoría y subcategoría
  // const categoriaId = await getCategoriaIdByDescripcion(categoriadescripcion);
  // const subcategoriaId = await getSubcategoriaIdByDescripcion(subcategoriadescripcion);
  // const fechaModificacion = new Date(); 

  if (!categoriadescripcion || !subcategoriadescripcion) {
    return { message: 'Categoría o subcategoría no encontrada.' };
  }

  try {
    // Insertar el nuevo producto en la base de datos
    await sql`
     INSERT INTO productos (descripcion_producto, precio_costo, precio_unitario, categoria_id, subcategoria_id)
      VALUES (${descripcionproducto}, ${preciocostocent}, ${preciounitariocent}, ${categoriadescripcion}, ${subcategoriadescripcion});
    `;

    
  } catch (error) {
    console.error('Error al insertar producto:', error);
    return { message: 'Error en la base de datos: No se pudo crear el producto.' };
  }
  revalidatePath('/dashboard/vistaProductos'); // Revalidar la caché
  redirect('/dashboard/vistaProductos'); // Redirigir al usuario
 
}



  export async function updateProduct(
    id: string,
    prevState: State,
    formData: FormData,
  ) {
    const validatedFields = FormSchema.safeParse({
      descripcionproducto: formData.get('descripcionproducto'),
      preciocosto: formData.get('preciocosto'),
      preciounitario: formData.get('preciounitario'),
      categoriadescripcion: formData.get('categoriadescripcion'), // Cambiado a descripción
      subcategoriadescripcion: formData.get('subcategoriadescripcion'), // Cambiado a descripción
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
    const {
      descripcionproducto,
      preciocosto,
      preciounitario,
      categoriadescripcion,
      subcategoriadescripcion,
    } = validatedFields.data;    
    const preciocostocent = preciocosto * 100;
    const preciounitariocent = preciounitario * 100;
   
    try {
      await sql`
      UPDATE productos
      SET 
        descripcion_producto = ${descripcionproducto},
        precio_costo = ${preciocostocent},
        precio_unitario = ${preciounitariocent},
        categoria_id = ${categoriadescripcion},
        subcategoria_id = ${subcategoriadescripcion}
      WHERE id_producto = ${id};
    `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/vistaProductos');
    redirect('/dashboard/vistaProductos');
  }

  