'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 

const FormSchema = z.object({
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

  const CreateInvoice = FormSchema.omit({ id: true, date: true });
  const UpdateInvoice = FormSchema.omit({ id: true, date: true });

  

  export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

  
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
    id_cliente:id,
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
