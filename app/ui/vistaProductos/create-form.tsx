'use client';

import {
  categorias,
  subcategorias
} from '@/app/lib/definitions';
import {
  QueueListIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduct, Stateprod } from '@/app/lib/actions'; // Asegúrate de que esta ruta sea correcta
import { useActionState } from 'react';
import { useState } from 'react';

export default function FormCreate({
  categorias,
  subcategorias
}: {
  categorias: categorias[];
  subcategorias: subcategorias[];
}) {
  const initialState: Stateprod = { message: null, errors: {} };
  const [StateForm, formAction] = useActionState(createProduct, initialState);
  console.log('Estado de la acción:', StateForm);
  

// Estado para las subcategorías filtradas

const [filteredSubcategories, setFilteredSubcategories] = useState<subcategorias[]>(subcategorias);

const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedCategoryId = event.target.value; // Mantener como cadena
  const filtered = subcategorias.filter(subcategoria => String(subcategoria.categoria_id) === selectedCategoryId);
  setFilteredSubcategories(filtered);
};





// const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedCategoryId = event.target.value; // Mantener como string

//   console.log("Selected Category ID:", selectedCategoryId);

//   const filtered = subcategorias.filter(
//     (subcategory) => (subcategory.categoria_id) === selectedCategoryId // Convertir a string
//   );
//   console.log("Filtered Subcategories:", filtered);

//   setFilteredSubcategories(filtered);
// };




  // // Manejo del envío del formulario
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  //   console.log('Formulario enviado'); // Depuración
    
  //   const formData = new FormData(event.currentTarget); // Obtener los datos del formulario

  //   try {
  //     const result = await formAction(formData); // Pasar el FormData a formAction
  //     console.log('Resultado de createProduct:', result);

  //   } catch (error) {
  //     console.error('Error al crear el producto:', error);
  //   }
  // };

  return (
    <form action={formAction}> {/* Cambiar a onSubmit */}
      {/* Product Description */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Ingresa el Producto
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="description"
            name="descripcionproducto"
            type="text"
            placeholder="Ingrese descripción"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Cost Price */}
      <div className="mb-4">
        <label htmlFor="costprice" className="mb-2 block text-sm font-medium">
          Precio Costo
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="costprice"
            name="preciocosto"
            type="number"
            step="0.01"
            placeholder="Enter GTQ cost price"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Unit Price */}
      <div className="mb-4">
        <label htmlFor="unitprice" className="mb-2 block text-sm font-medium">
          Precio Unitario
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="unitprice"
            name="preciounitario"
            type="number"
            step="0.01"
            placeholder="Enter GTQ unit price"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="mb-2 block text-sm font-medium">
          Selecciona Categoria
        </label>
        <div className="relative">
          <select
            id="category"
            name="categoriadescripcion"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            defaultValue=""
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
            Categoria...
            </option>
            {categorias.map(categoria => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.descripcion_categoria}
              </option>
            ))}
          </select>
          <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <div aria-live="polite" aria-atomic="true">
          {StateForm.errors?.categoriadescripcion &&
            StateForm.errors.categoriadescripcion.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Subcategory Dropdown */}
      <div className="mb-4">
        <label htmlFor="subcategory" className="mb-2 block text-sm font-medium">
        Selecciona subcategoria
        </label>
        <div className="relative">
          <select
            id="subcategory"
            name="subcategoriadescripcion"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            defaultValue=""
          >
            <option value="" disabled>
            subcategoria...
            </option>
            {
              filteredSubcategories.map(subcategoria => (
                <option key={subcategoria.id_subcategoria} value={subcategoria.id_subcategoria}>
                  {subcategoria.descripcion_subcategoria}
                </option>
              ))}
           
          </select>
          <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <div aria-live="polite" aria-atomic="true">
          {StateForm.errors?.subcategoriadescripcion &&
            StateForm.errors.subcategoriadescripcion.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vistaProductos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Guardar Producto</Button>
      </div>
    </form>
  );
}
