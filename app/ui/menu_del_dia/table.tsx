import Image from 'next/image';
import { UpdateClientess, DeleteClientes } from '@/app/ui/clientes/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredClientes, fetchFilteredMenudia} from '@/app/lib/data';
import { UpdateClientes } from '@/app/lib/actions';

export default async function menudiaTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const menu = await fetchFilteredMenudia(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
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
                  descripcion_cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  descripcion_menu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 dia_semana
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                fecha_configuracion
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {menu?.map((cliente) => (
                
                <tr
                  key={cliente.cliente_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                  
                      <p>{cliente.id_configuracion}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.cliente_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.menu_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(cliente.fecha_configuracion)}
                  </td>
                  
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      
                      <UpdateClientess id={cliente.id_configuracion} />
                      <DeleteClientes id={cliente.id_configuracion} />
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
