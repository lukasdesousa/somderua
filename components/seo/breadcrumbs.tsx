import Link from "next/link";

type BreadcrumbsProps = {
  items: Array<{ name: string; href?: string }>;
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 text-sm text-indigo-200/65 sm:px-6">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link className="hover:text-indigo-300" href={item.href}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.name}</span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
