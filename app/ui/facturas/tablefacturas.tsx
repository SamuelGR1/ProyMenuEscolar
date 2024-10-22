import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/facturas/buttons';
import InvoiceStatus from '@/app/ui/facturas/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/datafacturas';
import type { InvoicesTable } from '@/app/lib/definitionsfacturas';  // Importación de solo tipo

// Definir el tipo Invoice
type Invoice = {
  id_factura: string;  // Cambiado a string
  cliente: {
    name: string;
    email: string;
    image_url: string;
  };
  fecha_factura: string;
  total_factura: number;
  status: 'pending' | 'paid';
};

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Obtener las facturas del tipo InvoicesTable
  const Invoices: InvoicesTable[] = await fetchFilteredInvoices(query, currentPage);

  // Mapear las facturas al tipo Invoice
  const invoices: Invoice[] = Invoices.map((invoice) => ({
    id_factura: String(invoice.id_factura),  // Convertir id_factura a string
    cliente: {
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
    },
    fecha_factura: invoice.fecha_factura,
    total_factura: invoice.total_factura,
    status: invoice.status,
  }));

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id_factura}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.cliente.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.cliente.name}'s profile picture`}
                      />
                      <p>{invoice.cliente.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.cliente.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.total_factura)}
                    </p>
                    <p>{formatDateToLocal(invoice.fecha_factura)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id_factura} />
                    <DeleteInvoice id={invoice.id_factura} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id_factura}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.cliente.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.cliente.name}'s profile picture`}
                      />
                      <p>{invoice.cliente.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.cliente.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.total_factura)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.fecha_factura)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id_factura} />
                      <DeleteInvoice id={invoice.id_factura} />
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
