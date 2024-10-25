'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 


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



  const FormSchem = z.object({
    id_cliente: z.string(),
    nombre_cliente: z.string({
      invalid_type_error: 'Please enter a valid name.',
    }),
    telefono_cliente: z.coerce.number().gt(0, { message: 'Please enter a valid phone number.' }), // Ajustado el mensaje de error
    direccion_cliente: z.string({
      invalid_type_error: 'Please enter a valid address.',
    }), // Cambiado de z.enum a z.string() para direcciones
    fecha_registro: z.string(),  
  });

  const createCliente= FormSchem.omit({ id_cliente: true});
  const UpdateCliente = FormSchem.omit({ id_cliente: true,});

  
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
    prevState: Stateprod,
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



  export async function deleteProductos(id: string) {


    try {
      await sql`DELETE FROM productos
       WHERE id_producto = ${id}`;
      revalidatePath('/dashboard/vistaProductos');
      return { message: 'Producto Eliminado.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Producto.' };
    }
  }
  //solosamu-----------------------------------------------------

  export type Stat = {
    errors?: {
      id_cliente?: string[];
      nombre_cliente?: string[];
      telefono_cliente?: string[];
      direccion_cliente?: string[];
      fecha_registro?: string[];
    };
    message?: string  | null;
  };

 //clientes
 export async function createClientes(prevState: Stat, formData: FormData): Promise<Stat> {
  // Validar formulario usando Zod
  const validatedFields = createCliente.safeParse({
    id_cliente: formData.get('id_cliente'),
    nombre_cliente: formData.get('nombre_cliente'),
    telefono_cliente: formData.get('telefono_cliente'),
    direccion_cliente: formData.get('direccion_cliente'),
    fecha_registro: formData.get('fecha_registro'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Cliente.',
    };
  }

  const { nombre_cliente, telefono_cliente, direccion_cliente, fecha_registro } = validatedFields.data;

  try {
    await sql`
      INSERT INTO clientes (nombre_cliente, telefono_cliente, direccion_cliente, fecha_registro)
      VALUES (${nombre_cliente}, ${telefono_cliente}, ${direccion_cliente}, ${fecha_registro})
    `;
  } catch (error: any) {  // Usar 'any' para capturar cualquier tipo de error
    const errorMessage = error.message || 'Unknown error occurred during database operation.';
    return {
      message: `Database Error: ${errorMessage}. Failed to Create Cliente.`,
    };
  }

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');

  return { errors: {}, message: 'Cliente creado con éxito.' };
}


export async function UpdateClientes  (
  id: string,
  prevState: Stat,
  formData: FormData,
): Promise<Stat> {
  const validatedFields = UpdateCliente.safeParse({
    
    nombre_cliente: formData.get('nombre_cliente'),
    telefono_cliente: formData.get('telefono_cliente'),
    direccion_cliente: formData.get('direccion_cliente'),
    fecha_registro: formData.get('fecha_registro'),
    
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update clientes.',
    };
  }
 
  const {nombre_cliente, telefono_cliente, direccion_cliente, fecha_registro} = validatedFields.data;
  
 
  try {
    await sql`
      UPDATE clientes
      SET nombre_cliente = ${nombre_cliente}, telefono_cliente = ${telefono_cliente}, direccion_cliente = ${direccion_cliente}, fecha_registro = ${fecha_registro}
      WHERE id_cliente = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update clientes.' };
  }
 
  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}


//Eliminar CLientes


export async function deleteClientes(id: string) {


  try {
    await sql`DELETE FROM clientes WHERE id_cliente = ${id}`;
    revalidatePath('/dashboard/clientes');
    return { message: 'Deleted clientes.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete clientes.' };
  }
}

//menu

export async function createmenudia(prevState: Stat, formData: FormData): Promise<Stat> {
  // Validar formulario usando Zod
  const validatedFields = createCliente.safeParse({
    id_cliente: formData.get('id_cliente'),
    nombre_cliente: formData.get('nombre_cliente'),
    telefono_cliente: formData.get('telefono_cliente'),
    direccion_cliente: formData.get('direccion_cliente'),
    fecha_registro: formData.get('fecha_registro'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Cliente.',
    };
  }

  const { nombre_cliente, telefono_cliente, direccion_cliente, fecha_registro } = validatedFields.data;

  try {
    await sql`
      INSERT INTO clientes (nombre_cliente, telefono_cliente, direccion_cliente, fecha_registro)
      VALUES (${nombre_cliente}, ${telefono_cliente}, ${direccion_cliente}, ${fecha_registro})
    `;
  } catch (error: any) {  // Usar 'any' para capturar cualquier tipo de error
    const errorMessage = error.message || 'Unknown error occurred during database operation.';
    return {
      message: `Database Error: ${errorMessage}. Failed to Create Cliente.`,
    };
  }

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');

  return { errors: {}, message: 'Cliente creado con éxito.' };
}
//Fernanda-----------------------------------------------------------------------------------

