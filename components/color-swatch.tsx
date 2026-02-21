import { CopyButton } from "@/components/copy-button"
import { ColorSwatchInteractive } from "@/components/color-swatch-interactive.client"

interface ColorSwatchProps {
  color: string
  onClick?: () => void
  showHex?: boolean
}

export function ColorSwatch({ color, onClick, showHex = false }: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ColorSwatchInteractive color={color} onClick={onClick}>
        <div
          className="relative w-20 h-20 rounded-lg cursor-pointer hover:scale-105 transition-transform group"
          style={{ backgroundColor: color }}
        />
      </ColorSwatchInteractive>
      {showHex && (
        <div className="relative">
          <CopyButton
            value={color}
            label={color}
            variant="ghost"
            size="sm"
            showIcon={false}
            className="text-xs font-mono hover:text-primary transition-colors px-2 py-1 -mx-2"
          />
        </div>
      )}
    </div>
  )
}
