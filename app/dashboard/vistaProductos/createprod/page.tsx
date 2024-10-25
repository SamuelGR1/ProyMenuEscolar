import Form from '@/app/ui/vistaProductos/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {fetchCategorias, fetchSubcategorias} from '@/app/lib/data';
 
export default async function Page() {
  const categorias = await fetchCategorias();
  const subcategorias = await fetchSubcategorias();

 
  

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Producto', href: '/dashboard/vistaProductos' },
          {
            label: 'Registra Producto',
            href: '/dashboard/vistaProductos/createprod',
            active: true,
          },
        ]}
      />
      <Form  categorias={categorias} subcategorias={subcategorias}/>
    </main>
  );
}