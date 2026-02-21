import { ColorLibraryClient } from "@/components/color-library.client"

interface ColorLibraryProps {
  initialCategory?: string
  page?: number
  hidePagination?: boolean
}

export function ColorLibrary(props: ColorLibraryProps) {
  return <ColorLibraryClient {...props} />
}
