"use client"

import { useState } from "react"
import { CreditCard, ChevronDown, ChevronUp } from "lucide-react"

interface PaymentMethodProps {
  onContinue: (method: string) => void
  onBack: () => void
}

export function PaymentMethod({ onContinue, onBack }: PaymentMethodProps) {
  const [selected, setSelected] = useState<"debit" | "credit" | "">("")
  const [showMore, setShowMore] = useState(false)
  const [error, setError] = useState(false)

  const handleContinue = () => {
    if (!selected) {
      setError(true)
      return
    }
    setError(false)
    onContinue(selected)
  }

  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 md:py-8">
      <button
        onClick={onBack}
        className="text-[#3483FA] text-sm mb-4 hover:underline flex items-center gap-1"
      >
        {"< Volver"}
      </button>

      <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 md:mb-6">{"Elegi como pagar"}</h1>

      <div className="bg-white rounded-md shadow-sm">
        {/* Debit option */}
        <label
          className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 cursor-pointer border-b border-[#EEEEEE] ${
            selected === "debit" ? "bg-[#F5F9FF]" : ""
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="debit"
            checked={selected === "debit"}
            onChange={() => {
              setSelected("debit")
              setError(false)
            }}
            className="h-4 w-4 text-[#3483FA] accent-[#3483FA] border-[#E0E0E0]"
          />
          <div className="bg-[#F5F5F5] p-2 rounded">
            <CreditCard className="h-5 w-5 text-[#666]" />
          </div>
          <span className="text-sm text-[#333]">{"Nueva tarjeta de debito"}</span>
        </label>

        {/* Credit option */}
        <label
          className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 cursor-pointer ${
            selected === "credit" ? "bg-[#F5F9FF]" : ""
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="credit"
            checked={selected === "credit"}
            onChange={() => {
              setSelected("credit")
              setError(false)
            }}
            className="h-4 w-4 text-[#3483FA] accent-[#3483FA] border-[#E0E0E0]"
          />
          <div className="bg-[#F5F5F5] p-2 rounded">
            <CreditCard className="h-5 w-5 text-[#666]" />
          </div>
          <span className="text-sm text-[#333]">{"Nueva tarjeta de credito"}</span>
        </label>

        {/* Show more */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-between w-full px-4 md:px-6 py-3 md:py-4 border-t border-[#EEEEEE] text-[#3483FA] text-sm font-medium hover:bg-[#F5F9FF] transition-colors"
        >
          <span>{"Mostrar mas medios de pago"}</span>
          {showMore ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showMore && (
          <div className="px-4 md:px-6 pb-4 border-t border-[#EEEEEE]">
            <div className="py-4 text-sm text-[#999]">
              {"Mas medios de pago disponibles proximamente."}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#F23D4F] mt-2">
          {"Selecciona un medio de pago para continuar."}
        </p>
      )}

      {/* Continue button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#3483FA] hover:bg-[#2968c8] text-white font-medium text-sm px-6 py-3 rounded-md transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
