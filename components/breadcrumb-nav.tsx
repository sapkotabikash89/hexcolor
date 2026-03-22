import Link from "@/components/force-reload-link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  // Check if the first item is already "HexColorMeans" to avoid duplication
  const allItems: BreadcrumbItem[] = items[0]?.label === "HexColorMeans"
    ? items
    : [{ label: "HexColorMeans", href: "/" }, ...items]

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4">
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li
                key={`${item.href}-${index}`}
                className="opacity-80 flex items-center"
              >
                {isLast ? (
                  <span className="font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    <span>{item.label}</span>
                  </Link>
                )}

                {!isLast ? (
                  <span className="mx-2 text-muted-foreground" aria-hidden="true">
                    <ChevronRight className="inline-block h-4 w-4 align-middle" />
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
