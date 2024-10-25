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
  const initialState: Stat = { message: '', errors: {} }; // Asegúrate de que 'message' no sea null
  const [formState, formAction] = useActionState(createClientes, initialState); // Usamos 'formState'

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
       {/* Customer Name */}
<div className="mb-4">
  <label htmlFor="cliente_id" className="mb-2 block text-sm font-medium">
    descripcion_cliente
  </label>
  <div className="relative mt-2 rounded-md">
    <div className="relative">
      <select
        id="cliente_id"
        name="cliente_id"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      >
        <option value="" disabled selected>
          Seleccione un cliente
        </option>
        <option value="cliente1">Cliente 1</option>
        <option value="cliente2">Cliente 2</option>
        <option value="cliente3">Cliente 3</option>
      </select>
      <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  </div>
</div>


    {/* Menu Description */}
<div className="mb-4">
  <label htmlFor="menu_id" className="mb-2 block text-sm font-medium">
    descripcion_menu
  </label>
  <div className="relative mt-2 rounded-md">
    <div className="relative">
      <select
        id="menu_id"
        name="menu_id"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        required
      >
        <option value="" disabled selected>
          Seleccione un menú
        </option>
        <option value="menu1">Menú 1</option>
        <option value="menu2">Menú 2</option>
        <option value="menu3">Menú 3</option>
      </select>
    </div>
  </div>
</div>

        {/* Dia de la semana (Seleccionable) */}
        <div className="mb-4">
          <label htmlFor="dia_semana" className="mb-2 block text-sm font-medium">
            Dia_de_semana
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="dia_semana"
                name="dia_semana"
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 text-gray-700"
                required
              >
                <option value="">Seleccione un día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="mb-4">
          <label htmlFor="fecha_registro" className="mb-2 block text-sm font-medium">
            Ingrese Fecha de Registro
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="fecha_registro"
                name="fecha_registro"
                type="date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
