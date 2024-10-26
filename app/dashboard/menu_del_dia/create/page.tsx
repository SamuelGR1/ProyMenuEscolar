import Formmenudia from '@/app/ui/menu_del_dia/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchFilteredMenudia, fetchFilteredClientes } from '@/app/lib/data';
import { clientes, menus } from '@/app/lib/definitions';

export default async function Page() {
  const queryMenudia = ''; 
  const currentPageMenudia = 1;
  const queryClientes = ''; 
  const currentPageClientes = 1;

  const clientesData: clientes[] = await fetchFilteredClientes(queryClientes, currentPageClientes);
  const menusData: menus[] = await fetchFilteredMenudia(queryMenudia, currentPageMenudia);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'menu_del_dia', href: '/dashboard/menu_del_dia' },
          {
            label: 'Crear Menú del Día',
            href: '/dashboard/menu_del_dia/create',
            active: true,
          },
        ]}
      />
      <Formmenudia
        clientes={clientesData}
        menu={menusData}
      />
    </main>
  );
}
