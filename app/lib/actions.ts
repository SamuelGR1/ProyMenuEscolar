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