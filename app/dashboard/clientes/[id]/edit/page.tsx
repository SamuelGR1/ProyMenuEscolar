import Form from '@/app/ui/clientes/edit-form';
import Breadcrumbs from '@/app/ui/clientes/breadcrumbs';
import { fetchClienteById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import clientesTable from '@/app/ui/clientes/table';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  console.log('ID del cliente:', id); // Verifica el id

  // Obtener cliente por ID
const cliente = await fetchClienteById(id);
//   const [cliente] = await Promise.all([
//     fetchClienteById(id),
  
//   ]);
  console.log('Cliente obtenido:', cliente); // Para verificar el contenido de cliente

  // Si no se encuentra el cliente, redirigir a una página 404
  if (!cliente) {
      notFound();
  }

  return (
      <main>
          <Breadcrumbs
              breadcrumbs={[
                  { label: 'Clientes', href: '/dashboard/clientes' },
                  {
                      label: 'Edit Clientes',
                      href: `/dashboard/clientes/${id}/edit`,
                      active: true,
                  },
              ]}
          />
          <Form cliente={cliente} />
      </main>
  );
}
