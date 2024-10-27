import Image from 'next/image';
import { UpdateFactura, DeleteFactura } from '@/app/ui/facturas/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utilsfactura';
import { fetchFilteredInvoices } from '@/app/lib/datafactura';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id_detalle_factura}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
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
                      {typeof invoice.costo_total === 'number'
                        ? formatCurrency(invoice.costo_total)
                        : 'Error en costo total'}
                    </p>
                    <p>
                      {/* Validación de tipo para fecha_creacion */}
                      {typeof invoice.fecha_creacion === 'string' 
                        ? formatDateToLocal(invoice.fecha_creacion) 
                        : (invoice.fecha_creacion instanceof Date 
                            ? formatDateToLocal(invoice.fecha_creacion.toISOString()) // Convertir a string si es Date
                            : 'Error en fecha de creación')}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateFactura id={String(invoice.id_detalle_factura)} />
                    <DeleteFactura id={String(invoice.id_detalle_factura)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID Menu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Descripción Menu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Costo Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha Creación
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id_detalle_factura}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {invoice.menu_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.descripcion_menu}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {typeof invoice.costo_total === 'number'
                      ? formatCurrency(invoice.costo_total)
                      : 'Error en costo total'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* Validación de tipo para fecha_creacion */}
                    {typeof invoice.fecha_creacion === 'string' 
                      ? formatDateToLocal(invoice.fecha_creacion) 
                      : (invoice.fecha_creacion instanceof Date 
                          ? formatDateToLocal(invoice.fecha_creacion.toISOString())
                          : 'Error en fecha de creación')}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateFactura id={String(invoice.id_detalle_factura)} />
                      <DeleteFactura id={String(invoice.id_detalle_factura)} />
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







