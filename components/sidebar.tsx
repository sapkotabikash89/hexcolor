import { ColorSidebarClient } from "@/components/color-sidebar.client"

interface ColorSidebarProps {
  color: string
  onColorChange?: (color: string) => void
  showColorSchemes?: boolean
  showLatestPosts?: boolean
  className?: string
}

export function ColorSidebar(props: ColorSidebarProps) {
  return <ColorSidebarClient {...props} />
}
