'use client';

//import { CustomerClientes, CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
// Cambiar a createClientes
import { createClientes, Stat } from '@/app/lib/actions';
import { useActionState } from 'react';


export default function Form() {
  const initialState: Stat = { message: '', errors: {} };  // Asegúrate de que 'message' no sea null

  // Renombramos 'Stat' a 'formState'
  const [formState, formAction] = useActionState(createClientes, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Ingrese Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nombre_cliente"
                name="nombre_cliente"
                type="text"
                placeholder="Nombre"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="telefono_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Teléfono
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="telefono_cliente"
                name="telefono_cliente"
                type="tel"
                placeholder="Ingrese Número de Teléfono"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Ingrese Dirección
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="direccion_cliente"
                name="direccion_cliente"
                type="text"
                placeholder="Ingrese Dirección"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="mb-4">
          <label htmlFor="registrationDate" className="mb-2 block text-sm font-medium">
            Ingrese Fecha de Registro
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="fecha_registro"
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
        <Button type="submit">Create Cliente</Button>
      </div>
    </form>
  );
}
