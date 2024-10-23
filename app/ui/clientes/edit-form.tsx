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
        {/* Customer Name */}
       {/* Customer Name */}
<div className="mb-4">
  <label htmlFor="customer" className="mb-2 block text-sm font-medium">
    Ingrese Nombre del Cliente
  </label>
  <div className="relative">
    <input
      id="customer"
      name="nombre_cliente"
      type="text"
      placeholder="Ingrese Nombre del Cliente"
      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      defaultValue={cliente.id_cliente} // Asumiendo que `invoice.customer_name` es el nombre del cliente
      required
    />
    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
  </div>


          {/* Mostrar error del cliente */}
          {Stat.errors?.nombre_cliente && (
            <p className="mt-1 text-sm text-red-600">
              {Stat.errors.nombre_cliente[0]}
            </p>
          )}
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
    Ingrese Teléfono
  </label>
  <div className="relative mt-2 rounded-md">
    <div className="relative">
      <input
        id="phone"
        name="telefono_cliente"
        type="tel"
        placeholder="Ingrese Número de Teléfono"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      
              />
            
            </div>
          </div>
          {/* Mostrar error del telefono */}
          {Stat.errors?.telefono_cliente && (
            <p className="mt-1 text-sm text-red-600">
              {Stat.errors.telefono_cliente[0]}
            </p>
          )}
        </div>


 {/* Invoice Amount */}
 <div className="mb-4">
  <label htmlFor="address" className="mb-2 block text-sm font-medium">
    Ingrese Dirección
  </label>
  <div className="relative mt-2 rounded-md">
    <div className="relative">
      <input
        id="address"
        name="direccion_cliente"
        type="text"
        placeholder="Ingrese Dirección"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      />
         
              
            </div>
          </div>
          {/* Mostrar error del direccion */}
          {Stat.errors?.direccion_cliente && (
            <p className="mt-1 text-sm text-red-600">
              {Stat.errors.direccion_cliente[0]}
            </p>
          )}
        </div>


        {/* Invoice Status */}
        <div className="mb-4">
  <label htmlFor="registrationDate" className="mb-2 block text-sm font-medium">
    Ingrese Fecha de Registro
  </label>
  <div className="relative mt-2 rounded-md">
    <div className="relative">
      <input
        id="registrationDate"
        name="fecha_registro"
        type="date"
        placeholder="Fecha"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      />
              
            </div>
          </div>
        </div>
 
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/clientes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Editar</Button>
      </div>
      {/* Mostrar mensaje general si existe */}
      {Stat.message && (
        <p className="mt-4 text-sm text-red-600">{Stat.message}</p>
      )}
    </form>
  );
}