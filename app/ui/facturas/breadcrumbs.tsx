import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

// Interfaz para manejar los breadcrumbs
interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? 'page' : undefined}
            className={clsx(
              breadcrumb.active ? 'text-gray-900' : 'text-gray-500',
            )}
          >
            {/* Si no es el último breadcrumb, usa Link */}
            {breadcrumb.active ? (
              <span>{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            )}
            {/* Añadir separador si no es el último breadcrumb */}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-3 inline-block">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

