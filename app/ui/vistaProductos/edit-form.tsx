'use client';

import { categorias, subcategorias, ProductsForm } from '@/app/lib/definitions';
import { QueueListIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateProduct, Stateprod } from '@/app/lib/actions';
import { useActionState } from 'react';
import { useState, useEffect, FormEvent } from 'react';

export default function EditProducForm({
  producto,
  categorias,
  subcategorias,
}: {
  producto: ProductsForm;
  categorias: categorias[];
  subcategorias: subcategorias[];
}) {
  const initialState: Stateprod = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, producto.id_producto);
  const [StateForm, formAction] = useActionState(updateProductWithId, initialState);

  const [filteredSubcategories, setFilteredSubcategories] = useState<subcategorias[]>(subcategorias);
  const [selectedCategory, setSelectedCategory] = useState<string>(producto.descripcion_categoria || '');

  // Filtrar subcategorías según la categoría seleccionada al cargar la página
  useEffect(() => {
    const filtered = subcategorias.filter(
      (sub) => String(sub.categoria_id) === selectedCategory
    );
    setFilteredSubcategories(filtered);
  }, [selectedCategory, subcategorias]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value); // Actualizar categoría seleccionada
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evitar recarga de página
    formAction();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Descripción del Producto */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Ingresa el Producto
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="description"
            name="descripcionproducto"
            type="text"
            defaultValue={producto.descripcion_producto}
            placeholder="Ingrese descripción"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Precio Costo */}
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
            defaultValue={producto.precio_costo}
            placeholder="Enter GTQ cost price"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Precio Unitario */}
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
            defaultValue={producto.precio_unitario}
            placeholder="Enter GTQ unit price"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label htmlFor="category" className="mb-2 block text-sm font-medium">
          Selecciona Categoría
        </label>
        <div className="relative">
          <select
            id="category"
            name="categoriadescripcion"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          >
            <option value="" disabled>
              Categoría...
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.descripcion_categoria}
              </option>
            ))}
          </select>
          <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Subcategoría */}
      <div className="mb-4">
        <label htmlFor="subcategory" className="mb-2 block text-sm font-medium">
          Selecciona Subcategoría
        </label>
        <div className="relative">
          <select
            id="subcategory"
            name="subcategoriadescripcion"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          >
            <option value="" disabled>
              Subcategoría...
            </option>
            {filteredSubcategories.map((sub) => (
              <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                {sub.descripcion_subcategoria}
              </option>
            ))}
          </select>
          <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vistaProductos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Guardar Producto</Button>
      </div>
    </form>
  );
}
