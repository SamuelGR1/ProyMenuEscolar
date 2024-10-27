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
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
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

// Lógica de creación de facturas (invoices)
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO facturas (cliente_id, total_factura, fecha_factura)
      VALUES (${customerId}, ${amountInCents}, ${date})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Lógica de actualización de facturas
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
      UPDATE facturas
      SET cliente_id = ${customerId}, total_factura = ${amountInCents}
      WHERE id_factura = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Lógica de eliminación de facturas
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM facturas WHERE id_factura = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

// **NUEVOS DATOS**: Lógica para manejar los detalles de facturas
const InvoiceDetailSchema = z.object({
  factura_id: z.string(),
  menu_id: z.string(),
  costo_total: z.coerce.number().gt(0, { message: 'El costo debe ser mayor a $0.' }),
});

const CreateInvoiceDetail = InvoiceDetailSchema.omit({});
const UpdateInvoiceDetail = InvoiceDetailSchema.omit({});

export type InvoiceDetailState = {
  errors?: {
    menu_id?: string[];
    costo_total?: string[];
  };
  message?: string | null;
};

// Lógica de creación de detalles de facturas
export async function createInvoiceDetail(prevState: InvoiceDetailState, formData: FormData) {
  const validatedFields = CreateInvoiceDetail.safeParse({
    factura_id: formData.get('factura_id'),
    menu_id: formData.get('menu_id'),
    costo_total: formData.get('costo_total'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al crear detalle de factura.',
    };
  }

  const { factura_id, menu_id, costo_total } = validatedFields.data;

  try {
    await sql`
      INSERT INTO detalles_factura (factura_id, menu_id, costo_total)
      VALUES (${factura_id}, ${menu_id}, ${costo_total})
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al crear detalle de factura.' };
  }

  revalidatePath('/dashboard/invoice-details');
  redirect('/dashboard/invoice-details');
}

// Lógica de actualización de detalles de facturas
export async function updateInvoiceDetail(id: string, prevState: InvoiceDetailState, formData: FormData) {
  const validatedFields = UpdateInvoiceDetail.safeParse({
    factura_id: formData.get('factura_id'),
    menu_id: formData.get('menu_id'),
    costo_total: formData.get('costo_total'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al actualizar detalle de factura.',
    };
  }

  const { factura_id, menu_id, costo_total } = validatedFields.data;

  try {
    await sql`
      UPDATE detalles_factura
      SET factura_id = ${factura_id}, menu_id = ${menu_id}, costo_total = ${costo_total}
      WHERE id_detalle_factura = ${id}
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al actualizar detalle de factura.' };
  }

  revalidatePath('/dashboard/invoice-details');
  redirect('/dashboard/invoice-details');
}

// Lógica de eliminación de detalles de facturas
export async function deleteInvoiceDetail(id: string) {
  try {
    await sql`DELETE FROM detalles_factura WHERE id_detalle_factura = ${id}`;
    revalidatePath('/dashboard/invoice-details');
    return { message: 'Detalle de factura eliminado.' };
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al eliminar detalle de factura.' };
  }
}

// Lógica de creación de menús
const MenuSchema = z.object({
  id_menu: z.string(),
  descripcion_menu: z.string().min(1, { message: 'La descripción es requerida.' }),
  costo_total: z.coerce.number().gt(0, { message: 'El costo debe ser mayor a $0.' }),
});

const CreateMenu = MenuSchema.omit({ id_menu: true });
const UpdateMenu = MenuSchema.omit({ id_menu: true });

export type MenuState = {
  errors?: {
    descripcion_menu?: string[];
    costo_total?: string[];
  };
  message?: string | null;
};

// Lógica de creación de menús
export async function createMenu(prevState: MenuState, formData: FormData) {
  const validatedFields = CreateMenu.safeParse({
    descripcion_menu: formData.get('descripcion_menu'),
    costo_total: formData.get('costo_total'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al crear menú.',
    };
  }

  const { descripcion_menu, costo_total } = validatedFields.data;
  const fecha_creacion = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO menus (descripcion_menu, costo_total, fecha_creacion)
      VALUES (${descripcion_menu}, ${costo_total}, ${fecha_creacion})
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al crear menú.' };
  }

  revalidatePath('/dashboard/menus');
  redirect('/dashboard/menus');
}

// Lógica de actualización de menús
export async function updateMenu(id: string, prevState: MenuState, formData: FormData) {
  const validatedFields = UpdateMenu.safeParse({
    descripcion_menu: formData.get('descripcion_menu'),
    costo_total: formData.get('costo_total'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al actualizar menú.',
    };
  }

  const { descripcion_menu, costo_total } = validatedFields.data;

  try {
    await sql`
      UPDATE menus
      SET descripcion_menu = ${descripcion_menu}, costo_total = ${costo_total}
      WHERE id_menu = ${id}
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al actualizar menú.' };
  }

  revalidatePath('/dashboard/menus');
  redirect('/dashboard/menus');
}

// Lógica de eliminación de menús
export async function deleteMenu(id: string) {
  try {
    await sql`DELETE FROM menus WHERE id_menu = ${id}`;
    revalidatePath('/dashboard/menus');
    return { message: 'Menú eliminado.' };
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al eliminar menú.' };
  }
}

// **NUEVOS DATOS**: Lógica para manejar las configuraciones de menús**
const ConfigMenuSchema = z.object({
  cliente_id: z.string(),
  menu_id: z.string(),
  dia_semana: z.enum(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'], {
    invalid_type_error: 'Por favor selecciona un día válido.',
  }),
});

const CreateConfigMenu = ConfigMenuSchema.omit({});
const UpdateConfigMenu = ConfigMenuSchema.omit({});

export type ConfigMenuState = {
  errors?: {
    cliente_id?: string[];
    menu_id?: string[];
    dia_semana?: string[];
  };
  message?: string | null;
};

// Lógica de creación de configuraciones de menú
export async function createConfigMenu(prevState: ConfigMenuState, formData: FormData) {
  const validatedFields = CreateConfigMenu.safeParse({
    cliente_id: formData.get('cliente_id'),
    menu_id: formData.get('menu_id'),
    dia_semana: formData.get('dia_semana'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al crear la configuración del menú.',
    };
  }

  const { cliente_id, menu_id, dia_semana } = validatedFields.data;
  const fecha_configuracion = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO configuracion_menus (cliente_id, menu_id, dia_semana, fecha_configuracion)
      VALUES (${cliente_id}, ${menu_id}, ${dia_semana}, ${fecha_configuracion})
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al crear configuración de menú.' };
  }

  revalidatePath('/dashboard/configuracion_menus');
  redirect('/dashboard/configuracion_menus');
}

// Lógica de actualización de configuraciones de menú
export async function updateConfigMenu(id: string, prevState: ConfigMenuState, formData: FormData) {
  const validatedFields = UpdateConfigMenu.safeParse({
    cliente_id: formData.get('cliente_id'),
    menu_id: formData.get('menu_id'),
    dia_semana: formData.get('dia_semana'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al actualizar la configuración del menú.',
    };
  }

  const { cliente_id, menu_id, dia_semana } = validatedFields.data;

  try {
    await sql`
      UPDATE configuracion_menus
      SET cliente_id = ${cliente_id}, menu_id = ${menu_id}, dia_semana = ${dia_semana}
      WHERE id_configuracion = ${id}
    `;
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al actualizar configuración de menú.' };
  }

  revalidatePath('/dashboard/configuracion_menus');
  redirect('/dashboard/configuracion_menus');
}

// Lógica de eliminación de configuraciones de menú
export async function deleteConfigMenu(id: string) {
  try {
    await sql`DELETE FROM configuracion_menus WHERE id_configuracion = ${id}`;
    revalidatePath('/dashboard/configuracion_menus');
    return { message: 'Configuración de menú eliminada.' };
  } catch (error) {
    return { message: 'Error en la base de datos: Fallo al eliminar configuración de menú.' };
  }
}

// Autenticación
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
          return 'Credenciales inválidas.';
        default:
          return 'Ocurrió un error.';
      }
    }
    throw error;
  }
}
