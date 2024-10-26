import Formmenudia from '@/app/ui/menu_del_dia/create-form'; // Asegúrate de que el nombre del componente es correcto
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchFilteredMenudia, fetchFilteredClientes } from '@/app/lib/data'; // Asegúrate de importar ambas funciones
import { clientes, CustomerFieldmenudia } from '@/app/lib/definitions'; // Importa las definiciones necesarias

export default async function Page() {
  const queryMenudia = ''; // Define tu consulta para el menú del día aquí
  const currentPageMenudia = 1; // Número de página actual para el menú del día

  const queryClientes = ''; // Define tu consulta para los clientes aquí
  const currentPageClientes = 1; // Número de página actual para los clientes

  // Obtener los datos necesarios
  const customerFieldmenudia: CustomerFieldmenudia[] = await fetchFilteredMenudia(queryMenudia, currentPageMenudia);
  const clientesData: clientes[] = await fetchFilteredClientes(queryClientes, currentPageClientes); // Ahora pasamos los argumentos requeridos

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
        clientes={clientesData} // Pasar la lista de clientes
        customerFieldmenudia={customerFieldmenudia} // Pasar las subcategorías filtradas
      />
    </main>
  );
}
