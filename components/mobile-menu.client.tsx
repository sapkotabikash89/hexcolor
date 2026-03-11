"use client"

import { useState } from "react"
import Link from "@/components/force-reload-link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Disc, Pipette, Contrast, Eye, ImageIcon, LayoutGrid, Library, BookOpen, Mail, ShieldCheck } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 border-2 border-black rounded-md flex-shrink-0 ml-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/color-wheel/" onClick={() => setIsOpen(false)}>
              <Disc className="w-4 h-4" />
              Color Wheel
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/color-picker/" onClick={() => setIsOpen(false)}>
              <Pipette className="w-4 h-4" />
              Color Picker
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/contrast-checker/" onClick={() => setIsOpen(false)}>
              <Contrast className="w-4 h-4" />
              Contrast Checker
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/color-blindness-simulator/" onClick={() => setIsOpen(false)}>
              <Eye className="w-4 h-4" />
              Color Blindness Simulator
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/image-color-picker/" onClick={() => setIsOpen(false)}>
              <ImageIcon className="w-4 h-4" />
              Image Color Picker
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/palette-from-image/" onClick={() => setIsOpen(false)}>
              <LayoutGrid className="w-4 h-4" />
              Palette from Image
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/screen-color-picker/" onClick={() => setIsOpen(false)}>
              <Pipette className="w-4 h-4" />
              Screen Color Picker
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/colors/" onClick={() => setIsOpen(false)}>
              <Library className="w-4 h-4" />
              Color Library
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/blog/" onClick={() => setIsOpen(false)}>
              <BookOpen className="w-4 h-4" />
              Blog
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/contact/" onClick={() => setIsOpen(false)}>
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/privacy-policy/" onClick={() => setIsOpen(false)}>
              <ShieldCheck className="w-4 h-4" />
              Privacy
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

