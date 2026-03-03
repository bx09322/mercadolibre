"use client"

import { useState } from "react"
import { CreditCard, HelpCircle } from "lucide-react"

interface CardData {
  cardNumber: string
  holderName: string
  expiry: string
  cvv: string
  docType: string
  docNumber: string
  cardBrand: string
}

interface CardFormProps {
  paymentType: string
  onContinue: (data: CardData) => void
  onBack: () => void
}

type CardBrand = "visa" | "mastercard" | "amex" | "naranja" | "cabal" | "unknown"

function detectCardBrand(number: string): CardBrand {
  const clean = number.replace(/\s/g, "")
  if (!clean) return "unknown"
  if (/^4/.test(clean)) return "visa"
  if (/^5[1-5]/.test(clean)) return "mastercard"
  if (/^2[2-7]/.test(clean)) return "mastercard"
  if (/^3[47]/.test(clean)) return "amex"
  if (/^5895/.test(clean)) return "naranja"
  if (/^604[2-4]/.test(clean)) return "cabal"
  return "unknown"
}

function getCardBrandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa": return "VISA"
    case "mastercard": return "MASTERCARD"
    case "amex": return "AMEX"
    case "naranja": return "NARANJA"
    case "cabal": return "CABAL"
    default: return ""
  }
}

function CardBrandLogo({ brand }: { brand: CardBrand }) {
  if (brand === "visa") {
    return (
      <svg viewBox="0 0 48 16" className="w-12 h-5" fill="none">
        <path
          d="M18.87 1.02l-3.75 13.96h-3.09L15.78 1.02h3.09zM32.22 10.02l1.62-4.47.93 4.47h-2.55zm3.45 4.96h2.86L36.04 1.02h-2.64c-.59 0-1.1.35-1.32.88L27.5 14.98h3.06l.61-1.68h3.73l.35 1.68h.42zM27.14 10.18c.01-3.62-5.01-3.82-4.98-5.43.01-.49.48-1.01 1.51-1.15.51-.06 1.91-.11 3.5.59l.62-2.91A9.54 9.54 0 0 0 24.5.5c-2.88 0-4.9 1.53-4.92 3.72-.02 1.62 1.45 2.52 2.55 3.06 1.13.55 1.51.91 1.51 1.4-.01.76-.9 1.09-1.74 1.11-1.46.02-2.31-.39-2.98-.71l-.53 2.46c.68.31 1.93.58 3.23.6 3.06 0 5.06-1.51 5.07-3.86l-.05-.1zM15.24 1.02L10.34 14.98H7.24L4.8 3.43c-.15-.58-.28-.79-.73-1.04C3.35 2.02 2.04 1.68.82 1.47l.07-.45h4.95c.63 0 1.2.42 1.34 1.15l1.23 6.5 3.03-7.65h3.06l-.26 0z"
          fill="white"
        />
      </svg>
    )
  }

  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 48 30" className="w-10 h-5" fill="none">
        <circle cx="18" cy="15" r="12" fill="#EB001B" opacity="0.9" />
        <circle cx="30" cy="15" r="12" fill="#F79E1B" opacity="0.9" />
        <path
          d="M24 5.6a11.95 11.95 0 0 1 4.4 9.4 11.95 11.95 0 0 1-4.4 9.4 11.95 11.95 0 0 1-4.4-9.4A11.95 11.95 0 0 1 24 5.6z"
          fill="#FF5F00"
        />
      </svg>
    )
  }

  if (brand === "amex") {
    return (
      <div className="flex items-center justify-center w-10 h-5">
        <span className="text-white text-[10px] font-bold tracking-wide">AMEX</span>
      </div>
    )
  }

  if (brand === "naranja") {
    return (
      <div className="flex items-center justify-center w-10 h-5">
        <span className="text-[#FF6600] text-[10px] font-bold tracking-wide">NARANJA</span>
      </div>
    )
  }

  if (brand === "cabal") {
    return (
      <div className="flex items-center justify-center w-10 h-5">
        <span className="text-white text-[10px] font-bold tracking-wide">CABAL</span>
      </div>
    )
  }

  return null
}

function CardPreview({
  number,
  name,
  brand,
}: {
  number: string
  name: string
  brand: CardBrand
}) {
  const displayNumber = () => {
    const clean = number.replace(/\s/g, "")
    if (clean.length === 0) return "**** **** **** ****"
    const padded = clean.padEnd(16, "*")
    const groups = padded.match(/.{1,4}/g) || []
    return groups
      .map((g, i) => {
        if (i === 1 || i === 2) {
          return g.split("").map((ch) => (ch === "*" ? "*" : "*")).join("")
        }
        return g
      })
      .join(" ")
  }

  return (
    <div className="w-full max-w-[260px] aspect-[260/165] bg-[#1B2037] rounded-xl p-4 md:p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 right-8 w-[140px] h-[140px] rounded-full bg-white/[0.03] translate-y-1/2" />
      <div className="relative z-10 h-4" />
      <div className="relative z-10">
        <p className="text-white/90 text-xs md:text-sm tracking-[0.18em]">
          {displayNumber()}
        </p>
        {name && (
          <p className="text-white/60 text-[10px] md:text-xs mt-1.5 uppercase tracking-wide truncate">
            {name}
          </p>
        )}
      </div>
      <div className="flex justify-end relative z-10">
        {brand !== "unknown" ? (
          <CardBrandLogo brand={brand} />
        ) : (
          <div className="w-12 h-5" />
        )}
      </div>
    </div>
  )
}

function formatDNI(value: string): string {
  const clean = value.replace(/\D/g, "").substring(0, 8)
  if (clean.length <= 2) return clean
  if (clean.length <= 5) return clean.substring(0, 2) + "." + clean.substring(2)
  return clean.substring(0, 2) + "." + clean.substring(2, 5) + "." + clean.substring(5)
}

export function CardForm({ paymentType, onContinue, onBack }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [holderName, setHolderName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [docType, setDocType] = useState("DNI")
  const [docNumber, setDocNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showCvvHelp, setShowCvvHelp] = useState(false)

  const cardBrand = detectCardBrand(cardNumber)

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, "").substring(0, 16)
    return clean.replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, "").substring(0, 4)
    if (clean.length >= 3) {
      return clean.substring(0, 2) + "/" + clean.substring(2)
    }
    return clean
  }

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}
    if (cardNumber.replace(/\s/g, "").length < 13) newErrors.cardNumber = true
    if (!holderName) newErrors.holderName = true
    if (expiry.length < 5) newErrors.expiry = true
    if (cvv.length < 3) newErrors.cvv = true
    if (!docNumber) newErrors.docNumber = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onContinue({
        cardNumber: cardNumber.replace(/\s/g, ""),
        holderName,
        expiry,
        cvv,
        docType,
        docNumber,
        cardBrand: getCardBrandLabel(cardBrand),
      })
    }
  }

  const title =
    paymentType === "credit" ? "Nueva tarjeta de credito" : "Nueva tarjeta de debito"

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6 md:py-8">
      <button
        onClick={onBack}
        className="text-[#3483FA] text-sm mb-4 hover:underline flex items-center gap-1"
      >
        {"< Volver"}
      </button>

      <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 md:mb-6">{"Agrega una nueva tarjeta"}</h1>

      {/* Card type indicator */}
      <div className="flex items-center gap-3 bg-white rounded-md shadow-sm px-4 md:px-5 py-3 md:py-4 mb-4">
        <div className="bg-[#F5F5F5] p-2 rounded">
          <CreditCard className="h-5 w-5 text-[#666]" />
        </div>
        <span className="text-sm font-medium text-[#333]">{title}</span>
      </div>

      {/* Form + card preview */}
      <div className="bg-white rounded-md shadow-sm p-4 md:p-6">
        {/* Mobile card preview */}
        <div className="flex justify-center mb-6 md:hidden">
          <CardPreview number={cardNumber} name={holderName} brand={cardBrand} />
        </div>

        <div className="flex gap-8">
          {/* Form fields */}
          <div className="flex-1">
            {/* Card number */}
            <div className="mb-5">
              <label className="block text-xs text-[#333] mb-1 font-normal">
                {"Numero de tarjeta"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                  errors.cardNumber ? "border-[#F23D4F]" : "border-[#E0E0E0]"
                }`}
              />
              {cardBrand !== "unknown" && (
                <span className="text-xs text-[#00A650] mt-1 block">
                  {getCardBrandLabel(cardBrand)} detectada
                </span>
              )}
              {errors.cardNumber && (
                <span className="text-xs text-[#F23D4F] mt-1">
                  {"Ingresa un numero de tarjeta valido"}
                </span>
              )}
            </div>

            {/* Holder name */}
            <div className="mb-5">
              <label className="block text-xs text-[#333] mb-1 font-normal">
                Nombre del titular
              </label>
              <input
                type="text"
                placeholder={"Ej.: Maria Lopez"}
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                  errors.holderName ? "border-[#F23D4F]" : "border-[#E0E0E0]"
                }`}
              />
              <span className="text-xs text-[#999] mt-0.5 block">
                Como aparece en la tarjeta.
              </span>
              {errors.holderName && (
                <span className="text-xs text-[#F23D4F]">Este campo es obligatorio</span>
              )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs text-[#333] mb-1 font-normal">Vencimiento</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                    errors.expiry ? "border-[#F23D4F]" : "border-[#E0E0E0]"
                  }`}
                />
                {errors.expiry && (
                  <span className="text-xs text-[#F23D4F] mt-1">{"Ingresa el vencimiento"}</span>
                )}
              </div>
              <div>
                <label className="block text-xs text-[#333] mb-1 font-normal">
                  {"Codigo de seguridad"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej.: 123"
                    value={cvv}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "").substring(0, 4)
                      setCvv(clean)
                    }}
                    className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] pr-10 ${
                      errors.cvv ? "border-[#F23D4F]" : "border-[#E0E0E0]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvvHelp(!showCvvHelp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3483FA]"
                    aria-label="Ayuda sobre codigo de seguridad"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
                {showCvvHelp && (
                  <p className="text-xs text-[#999] mt-1">
                    {"Son los 3 o 4 digitos que se encuentran en el dorso de tu tarjeta."}
                  </p>
                )}
                {errors.cvv && (
                  <span className="text-xs text-[#F23D4F] mt-1">
                    {"Ingresa el codigo de seguridad"}
                  </span>
                )}
              </div>
            </div>

            {/* Document */}
            <div className="mb-5">
              <label className="block text-xs text-[#333] mb-1 font-normal">
                Documento del titular
              </label>
              <div className="flex gap-2">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="border border-[#E0E0E0] rounded-md px-3 py-2.5 text-sm text-[#333] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA]"
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIT">CUIT</option>
                  <option value="CUIL">CUIL</option>
                  <option value="CI">CI</option>
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="99.999.999"
                  value={docNumber}
                  onChange={(e) => setDocNumber(formatDNI(e.target.value))}
                  className={`flex-1 border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                    errors.docNumber ? "border-[#F23D4F]" : "border-[#E0E0E0]"
                  }`}
                />
              </div>
              {errors.docNumber && (
                <span className="text-xs text-[#F23D4F] mt-1">
                  {"Ingresa el documento del titular"}
                </span>
              )}
            </div>
          </div>

          {/* Desktop card preview */}
          <div className="hidden md:flex items-start pt-6">
            <CardPreview number={cardNumber} name={holderName} brand={cardBrand} />
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-[#3483FA] hover:bg-[#2968c8] text-white font-medium text-sm px-6 py-3 rounded-md transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
