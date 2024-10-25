'use client';
import { MenuField } from '@/app/lib/definitions'; 
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateMenu, State } from '@/app/lib/actions'; 
import { useActionState } from 'react';

// Definir el estado del menú
type MenuState = {
  message: string;
  errors: {
    descripcion_menu?: string[];
    costo_total?: string[];
  };
};

export default function EditMenuForm({
  menu,
}: {
  menu: MenuField; 
}) {
  const initialState: MenuState = { message: '', errors: {} }; 

  // Actualizar el menú utilizando una función asíncrona
  const updateMenuWithId = async (prevState: MenuState, formData: FormData) => {
    // Asegúrate de que menu.id_menu es de tipo string
    const result = await updateMenu(menu.id_menu as string, prevState, formData);
    return { ...prevState, ...result }; 
  };

  // Usar useActionState para manejar la acción
  const [state, formAction] = useActionState(updateMenuWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Descripción del Menú */}
        <div className="mb-4">
          <label htmlFor="descripcion_menu" className="mb-2 block text-sm font-medium">
            Descripción del Menú
          </label>
          <div className="relative">
            <input
              id="descripcion_menu"
              name="descripcion_menu"
              type="text"
              defaultValue={menu.descripcion_menu} 
              placeholder="Ingrese la descripción del menú"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.descripcion_menu && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.descripcion_menu[0]}
            </p>
          )}
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
              defaultValue={menu.costo_total} 
              placeholder="Ingrese el costo total"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.costo_total && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.costo_total[0]}
            </p>
          )}
        </div>

        {/* Fecha de Creación (solo lectura) */}
        <div className="mb-4">
          <label htmlFor="fecha_creacion" className="mb-2 block text-sm font-medium">
            Fecha de Creación
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="fecha_creacion"
              name="fecha_creacion"
              type="text"
              defaultValue={new Date(menu.fecha_creacion).toLocaleDateString()} 
              readOnly
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
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
        <Button type="submit">Editar Menú</Button>
      </div>
      {state.message && (
        <p className="mt-4 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}







