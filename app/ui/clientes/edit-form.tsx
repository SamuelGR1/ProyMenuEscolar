'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState);

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
      name="customerName"
      type="text"
      placeholder="Ingrese Nombre del Cliente"
      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      defaultValue={invoice.customer_id} // Asumiendo que `invoice.customer_name` es el nombre del cliente
      required
    />
    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
  </div>


          {/* Mostrar error del cliente */}
          {state.errors?.customerId && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.customerId[0]}
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
        name="phone"
        type="tel"
        placeholder="Ingrese Número de Teléfono"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      
              />
            
            </div>
          </div>
          {/* Mostrar error del monto */}
          {state.errors?.amount && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.amount[0]}
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
        name="address"
        type="text"
        placeholder="Ingrese Dirección"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      />
         
              
            </div>
          </div>
          {/* Mostrar error del monto */}
          {state.errors?.amount && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.amount[0]}
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
        name="registrationDate"
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
      {state.message && (
        <p className="mt-4 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}