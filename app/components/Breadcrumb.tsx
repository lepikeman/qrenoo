"use client";
import Link from "next/link";

export default function Breadcrumb({ items }: { items: { label: string, href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-gray-600">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline text-[#405c26]">{item.label}</Link>
            ) : (
              <span className="font-semibold">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}