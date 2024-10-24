import Image from 'next/image';
import { UpdateProducto, DeleteInvoice } from '@/app/ui/vistaProductos/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredproductos } from '@/app/lib/data';

export default async function productotable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const Productos = await fetchFilteredproductos(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* <div className="md:hidden">
            {Productos?.map((producto) => (
              <div
                key={producto.id_producto}
                className="mb-2 w-full rounded-md bg-white p-4">

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Producto
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Costo
                </th> 
                <th scope="col" className="px-3 py-5 font-medium">
                  Precio_Unitario
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Categoria
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  subCategoria
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                fecha_modificacion
                </th>
                
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Productos?.map((producto) => (
                <tr
                  key={producto.id_producto}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{producto.descripcion_producto}</p>
                    </div>
                  </td>
      
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(producto.precio_costo)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(producto.precio_unitario)}
                  </td>
                  
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{producto.descripcion_categoria}</p>
                    </div>
                  </td>


                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{producto.descripcion_subcategoria}</p>
                    </div>
                  </td>

                        
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{formatDateToLocal(producto.fecha_modificacion)}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProducto id={producto.id_producto} />
                      {/* <DeleteInvoice id={producto.id_producto} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
