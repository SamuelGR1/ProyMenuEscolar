'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Esquema de validación del formulario
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  totalAmount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),

  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Creación y actualización del esquema sin campos 'id' y 'date'
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Estado para manejar errores
export type State = {
  errors?: {
    customerId?: string[];
    totalAmount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Función para crear facturas
export async function createInvoice(prevState: State, formData: FormData) {
    // Validar formulario con Zod
    const validatedFields = CreateInvoice.safeParse({
      customerId: String(formData.get('customerId') || ''), // Asegurarse de que sea una cadena
      totalAmount: parseFloat(String(formData.get('totalAmount') || '0')), // Convertir a número
      status: String(formData.get('status') || ''), // Asegurarse de que sea una cadena
    });
  
    // Verificar si la validación falla
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
  
    const { customerId, totalAmount, status } = validatedFields.data;
    const date = new Date().toISOString(); // Fecha actual
  
    // Insertar datos en la tabla 'facturas'
    try {
      const invoiceResult = await sql`
        INSERT INTO facturas (cliente_id, fecha_factura, total_factura)
        VALUES (${customerId}, ${date}, ${totalAmount})
        RETURNING id_factura
      `;
  
      // Acceder a la primera fila de resultados usando 'rows'
      const facturaId = invoiceResult.rows[0].id_factura;
  
      // Insertar detalles de la factura (suponiendo que haya un menú relacionado)
      await sql`
        INSERT INTO detalles_factura (factura_id, menu_id, costo_total)
        VALUES (${facturaId}, ${parseInt(String(formData.get('menuId') || '0'))}, ${totalAmount})
      `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
  
    // Revalidar caché y redireccionar
    revalidatePath('/dashboard/facturas');
    redirect('/dashboard/facturas');
  }
  