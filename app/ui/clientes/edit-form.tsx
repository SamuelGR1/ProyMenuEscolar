'use client';

import { clientes } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { UpdateClientes, Stat } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditClienteForm({
  cliente,
}: {
  cliente: clientes;
}) {
  const initialState: Stat = { message: null, errors: {} };
  const updateInvoiceWithId = UpdateClientes.bind(null, cliente.id_cliente);
  const [Stat, formAction] = useActionState(updateInvoiceWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Hidden field for customer ID */}
        <input type="hidden" name="id_cliente" value={cliente.id_cliente} />
  
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="nombre_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Nombre del Cliente
          </label>
          <div className="relative">
            <input
              id="nombre_cliente"
              name="nombre_cliente"
              type="text"
              placeholder="Ingrese Nombre del Cliente"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={cliente.nombre_cliente}
              required
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {Stat.errors?.nombre_cliente && (
            <p className="mt-1 text-sm text-red-600">{Stat.errors.nombre_cliente[0]}</p>
          )}
        </div>
  
        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="telefono_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Teléfono
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="telefono_cliente"
              name="telefono_cliente"
              type="number"
              placeholder="Ingrese Número de Teléfono"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={cliente.telefono_cliente}
             
            />
          </div>
        
        </div>
  
        {/* Address */}
        <div className="mb-4">
          <label htmlFor="direccion_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Dirección
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="direccion_cliente"
              name="direccion_cliente"
              type="text"
              placeholder="Ingrese Dirección"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={cliente.direccion_cliente}
              required
            />
          </div>
        
        </div>
  
        {/* Registration Date */}
        <div className="mb-4">
          <label htmlFor="fecha_registro" className="mb-2 block text-sm font-medium">
            Ingrese Fecha de Registro
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              type="date"
              name="fecha_registro"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={cliente.fecha_registro ? String(cliente.fecha_registro).split('T')[0] : ''} // Verificación de null/undefined
              required
            />
          </div>
        </div>
  
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/clientes"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </Link>
          <Button type="submit">Editar</Button>
        </div>
  
        {Stat.message && (
          <p className="mt-4 text-sm text-red-600">{Stat.message}</p>
        )}
      </div>
    </form>
  );
}