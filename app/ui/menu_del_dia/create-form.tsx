'use client';

import Link from 'next/link';
import { CheckIcon, ClockIcon, CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createClientes, createmenudia, Stat, Stata } from '@/app/lib/actions';
import { useActionState } from 'react';
import { clientes, CustomerFieldmenudia } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';

export default function Formmenudia({
  clientes,
  customerFieldmenudia
}: {
  clientes: clientes[];
  customerFieldmenudia: CustomerFieldmenudia[];
}) {
  const initialState: Stata = { message: null, errors: {} };
  const [StateForm, formAction] = useActionState(createmenudia, initialState);
  console.log('Estado de la acción:', StateForm);

  const [filteredSubcategories, setFilteredSubcategories] = useState<CustomerFieldmenudia[]>(customerFieldmenudia);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    setSelectedCategoryId(id);
    const filtered = customerFieldmenudia.filter(subcategoria => String(subcategoria.id_configuracion) === id);
    setFilteredSubcategories(filtered);
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="cliente_id" className="mb-2 block text-sm font-medium">
            Descripción Cliente
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="cliente_id"
                name="cliente_id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              >
                <option value="" disabled>
                  Seleccione un cliente
                </option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nombre_cliente}</option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Menu Description */}
        <div className="mb-4">
          <label htmlFor="menu_id" className="mb-2 block text-sm font-medium">
            Descripción Menú
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="menu_id"
                name="menu_id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              >
                <option value="" disabled>
                  Seleccione un menú
                </option>
                {filteredSubcategories.map(subcategoria => (
                  <option key={subcategoria.id_configuracion} value={subcategoria.id_configuracion}></option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Día de la semana (Seleccionable) */}
        <div className="mb-4">
          <label htmlFor="dia_semana" className="mb-2 block text-sm font-medium">
            Día de Semana
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
          href="/dashboard/menu_del_dia"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Crear Cliente</Button>
      </div>
    </form>
  );
}
