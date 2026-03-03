"use client"

import { Search, Bell, ShoppingCart, ChevronDown, MapPin } from "lucide-react"
import { MercadoLibreLogo } from "./ml-logo"

interface HeaderProps {
  variant?: "full" | "simple"
}

export function Header({ variant = "full" }: HeaderProps) {
  if (variant === "simple") {
    return (
      <header className="bg-[#FFE600] w-full shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-2.5">
          <a href="https://www.mercadolibre.com.ar">
            <MercadoLibreLogo variant="icon" className="h-8 md:h-9" />
          </a>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-[#FFE600] w-full">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-2 md:gap-4 py-[10px]">
          <a href="https://www.mercadolibre.com.ar" className="shrink-0">
            <MercadoLibreLogo variant="full" />
          </a>

          {/* Search bar */}
          <div className="flex-1 max-w-[640px]">
            <div className="flex items-center bg-white rounded overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.12)]">
              <input
                type="text"
                placeholder="Buscar productos, marcas y mas..."
                className="flex-1 px-3 md:px-4 py-[9px] text-[14px] text-[#333] placeholder:text-[#999] outline-none bg-white border-none font-sans"
              />
              <div className="w-px h-[30px] bg-[#E6E6E6]" />
              <button
                className="px-3 md:px-4 py-[9px] text-[#666] hover:text-[#333] transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {/* Right icons - hidden on very small screens */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <a href="https://www.mercadolibre.com.ar/mis-compras" className="hidden lg:block text-[13px] text-[#333333] hover:text-[#3483FA] transition-colors">Mis compras</a>
            <a href="https://www.mercadolibre.com.ar/gz/favoritos" className="hidden xl:flex items-center gap-0.5 text-[13px] text-[#333333] hover:text-[#3483FA] transition-colors">
              Favoritos
              <ChevronDown className="h-3 w-3" />
            </a>
            <a href="https://www.mercadolibre.com.ar/notificaciones" aria-label="Notificaciones" className="hidden sm:block">
              <Bell className="h-[22px] w-[22px] text-[#333333]" />
            </a>
            <a href="https://www.mercadolibre.com.ar/gz/home/cart" aria-label="Carrito">
              <ShoppingCart className="h-[22px] w-[22px] text-[#333333]" />
            </a>
          </div>
        </div>

        {/* Location + Navigation */}
        <div className="flex items-center gap-4 md:gap-6 pb-[10px] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-1 text-[12px] text-[#333333] shrink-0 cursor-pointer hover:text-[#3483FA] transition-colors">
            <MapPin className="h-3.5 w-3.5 text-[#3483FA]" />
            <span className="hidden sm:inline">Enviar a</span>
            <span className="sm:hidden">Enviar</span>
          </div>

          <div className="h-3.5 w-px bg-[#D4D4D4] hidden sm:block" />

          <nav className="flex items-center gap-3 md:gap-4 text-[13px] text-[#333333]">
            <a href="https://www.mercadolibre.com.ar/categorias" className="flex items-center gap-0.5 hover:text-[#3483FA] shrink-0 transition-colors">
              Categorias <ChevronDown className="h-3 w-3" />
            </a>
            <a href="https://www.mercadolibre.com.ar/ofertas" className="hover:text-[#3483FA] shrink-0 transition-colors">
              Ofertas
            </a>
            <a href="https://www.mercadolibre.com.ar/cupones" className="hover:text-[#3483FA] shrink-0 transition-colors hidden sm:block">
              Cupones
            </a>
            <a href="https://www.mercadolibre.com.ar/supermercado" className="hover:text-[#3483FA] shrink-0 transition-colors hidden sm:block">
              Supermercado
            </a>
            <a href="https://www.mercadolibre.com.ar/moda" className="hidden md:block hover:text-[#3483FA] shrink-0 transition-colors">
              Moda
            </a>
            <a href="https://play.mercadolibre.com.ar" className="hidden md:block hover:text-[#3483FA] relative shrink-0 transition-colors">
              Mercado Play
              <span className="absolute -top-2.5 -right-[26px] bg-[#00A650] text-white text-[8px] px-1 rounded-sm font-bold uppercase">
                Gratis
              </span>
            </a>
            <a href="https://www.mercadolibre.com.ar/vender" className="hidden lg:block hover:text-[#3483FA] shrink-0 transition-colors">
              Vender
            </a>
            <a href="https://www.mercadolibre.com.ar/ayuda" className="hidden lg:block hover:text-[#3483FA] shrink-0 transition-colors">
              Ayuda
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
