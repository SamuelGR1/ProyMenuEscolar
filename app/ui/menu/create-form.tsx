'use client';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createMenu, MenuState } from '@/app/lib/actions';  // Ajustamos aquí la importación correcta
import { useActionState } from 'react';

export default function Form() {
  const initialState: MenuState = { message: '', errors: {} };  // `message` ahora es una string vacía
  const [state, formAction] = useActionState(createMenu, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Descripción del Menú */}
        <div className="mb-4">
          <label
            htmlFor="descripcion_menu"
            className="mb-2 block text-sm font-medium"
          >
            Descripción del Menú
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="descripcion_menu"
              name="descripcion_menu"
              type="text"
              placeholder="Ingrese la descripción del menú"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Costo Total */}
        <div className="mb-4">
          <label htmlFor="costo_total" className="mb-2 block text-sm font-medium">
            Costo Total
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="costo_total"
              name="costo_total"
              type="number"
              step="0.01"
              placeholder="Ingrese el costo total"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Fecha de Creación */}
        <div className="mb-4">
          <label htmlFor="fecha_creacion" className="mb-2 block text-sm font-medium">
            Fecha de Creación
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="fecha_creacion"
              name="fecha_creacion"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/menus"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Menú</Button>
      </div>
    </form>
  );
}



