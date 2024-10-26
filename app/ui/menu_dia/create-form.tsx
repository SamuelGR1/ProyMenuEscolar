'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createClientes, Stat } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() {
  const initialState: Stat = { message: '', errors: {} };

  const [formState, formAction] = useActionState(createClientes, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nombre Cliente */}
        <div className="mb-4">
          <label htmlFor="nombre_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Nombre
          </label>
          <div className="relative mt-2 rounded-md">
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

        {/* Teléfono Cliente */}
        <div className="mb-4">
          <label htmlFor="telefono_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Teléfono
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="telefono_cliente"
              name="telefono_cliente"
              type="tel"
              placeholder="Número de Teléfono"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Dirección Cliente */}
        <div className="mb-4">
          <label htmlFor="direccion_cliente" className="mb-2 block text-sm font-medium">
            Ingrese Dirección
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="direccion_cliente"
              name="direccion_cliente"
              type="text"
              placeholder="Dirección"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Fecha de Registro */}
        <div className="mb-4">
          <label htmlFor="fecha_registro" className="mb-2 block text-sm font-medium">
            Ingrese Fecha de Registro
          </label>
          <div className="relative mt-2 rounded-md">
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

        {/* Menú */}
        <div className="mb-4">
          <label htmlFor="menu_id" className="mb-2 block text-sm font-medium">
            Seleccione Menú
          </label>
          <select
            id="menu_id"
            name="menu_id"
            className="block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          >
            <option value="">Seleccione un menú</option>
            {/* Aquí se deben cargar dinámicamente las opciones de menú */}
          </select>
        </div>

        {/* Día de la Semana */}
        <div className="mb-4">
          <label htmlFor="dia_semana" className="mb-2 block text-sm font-medium">
            Día de la Semana
          </label>
          <select
            id="dia_semana"
            name="dia_semana"
            className="block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          >
            <option value="">Seleccione un día</option>
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miércoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
            <option value="sábado">Sábado</option>
            <option value="domingo">Domingo</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/clientes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Cliente</Button>
      </div>
    </form>
  );
}





