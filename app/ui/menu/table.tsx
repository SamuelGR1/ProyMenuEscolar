"use client"; // Añade esta línea al principio del archivo

import Image from 'next/image';
import { useState } from 'react';

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { UpdateClientess, DeleteClientes } from '../menu/buttons';

const virtualClientes = [
  {
    id_cliente: 1,
    nombre_cliente: "Menu espaggueti",
    telefono_cliente: "123-456-7890",
    fecha_registro: new Date('2024-01-01').toISOString(),
  },
  {
    id_cliente: 2,
    nombre_cliente: "Menu granos",
    telefono_cliente: "098-765-4321",
    fecha_registro: new Date('2024-02-15').toISOString(),
  },
  {
    id_cliente: 3,
    nombre_cliente: " Menu matutino",
    telefono_cliente: "456-789-0123",
    fecha_registro: new Date('2024-03-20').toISOString(),
  },
  // Agrega más clientes según sea necesario
];

export default function ClientesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // En lugar de hacer la llamada a la API, usamos datos virtuales
  const clientes = virtualClientes; // Aquí puedes filtrar si es necesario

  // Estado para almacenar productos ficticios y mostrar el modal
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProducts = (menuId: number) => {
    // Datos ficticios
    const products = ["Producto 1", "Producto 2", "Producto 3"];
    setSelectedProducts(products);
    setIsModalOpen(true); // Abre el modal con los productos ficticios
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nombre menu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Costo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha Registro
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Productos
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {clientes?.map((cliente) => (
                <tr
                  key={cliente.id_cliente}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{cliente.nombre_cliente}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.telefono_cliente}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(cliente.fecha_registro)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewProducts((cliente.id_cliente))}

                    >
                      Ver Productos
                    </button>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {/* <div className="flex justify-end gap-3">
                      <UpdateClientess id={cliente.id_cliente} />
                      <DeleteClientes id={cliente.id_cliente} />
                    </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para mostrar los productos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/3 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Productos del Menú</h2>
            <ul className="list-disc pl-5">
              {selectedProducts.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
