"use client"

import { useState } from "react"
import { Home, Briefcase } from "lucide-react"

interface AddressData {
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
}

interface AddressFormProps {
  onContinue: (data: AddressData) => void
}

export function AddressForm({ onContinue }: AddressFormProps) {
  const [address, setAddress] = useState("")
  const [noNumber, setNoNumber] = useState(false)
  const [postalCode, setPostalCode] = useState("")
  const [noPostalCode, setNoPostalCode] = useState(false)
  const [province, setProvince] = useState("")
  const [locality, setLocality] = useState("")
  const [department, setDepartment] = useState("")
  const [instructions, setInstructions] = useState("")
  const [domicileType, setDomicileType] = useState<"residential" | "work" | "">("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const provinces = [
    "Buenos Aires",
    "CABA",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Cordoba",
    "Corrientes",
    "Entre Rios",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquen",
    "Rio Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucuman",
  ]

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}
    if (!address) newErrors.address = true
    if (!postalCode && !noPostalCode) newErrors.postalCode = true
    if (!province) newErrors.province = true
    if (!fullName) newErrors.fullName = true
    if (!phone) newErrors.phone = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onContinue({
        address,
        noNumber,
        postalCode,
        noPostalCode,
        province,
        locality,
        department,
        instructions,
        domicileType,
        fullName,
        phone,
      })
    }
  }

  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 md:mb-6">Nuevo domicilio</h1>

      <div className="bg-white rounded-md shadow-sm p-4 md:p-6">
        {/* Address field */}
        <div className="mb-4">
          <label className="block text-xs text-[#333] mb-1 font-normal">
            {"Direccion o lugar de entrega"}
          </label>
          <input
            type="text"
            placeholder="Ej: Avenida los leones 4563"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
              errors.address ? "border-[#F23D4F]" : "border-[#E0E0E0]"
            }`}
          />
          {errors.address && (
            <span className="text-xs text-[#F23D4F] mt-1">Este campo es obligatorio</span>
          )}
        </div>

        {/* No number checkbox */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="noNumber"
            checked={noNumber}
            onChange={(e) => setNoNumber(e.target.checked)}
            className="h-4 w-4 rounded border-[#E0E0E0] text-[#3483FA] focus:ring-[#3483FA] accent-[#3483FA]"
          />
          <label htmlFor="noNumber" className="text-sm text-[#333]">
            Mi calle no tiene numero
          </label>
        </div>

        {/* Postal Code */}
        <div className="mb-6">
          <label className="block text-xs text-[#333] mb-1 font-normal">{"Codigo Postal"}</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Ej: 1425"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={noPostalCode}
              className={`w-full sm:w-[240px] border rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] disabled:bg-[#F5F5F5] disabled:text-[#999] ${
                errors.postalCode ? "border-[#F23D4F]" : "border-[#E0E0E0]"
              }`}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#333]">{"No se mi CP"}</span>
              <input
                type="checkbox"
                checked={noPostalCode}
                onChange={(e) => setNoPostalCode(e.target.checked)}
                className="h-4 w-4 rounded border-[#E0E0E0] text-[#3483FA] focus:ring-[#3483FA] accent-[#3483FA]"
              />
            </div>
          </div>
        </div>

        {/* Province & Locality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#333] mb-1 font-normal">Provincia</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                errors.province ? "border-[#F23D4F]" : "border-[#E0E0E0]"
              }`}
            >
              <option value="">Selecciona una provincia</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#333] mb-1 font-normal">
              {"Localidad / Barrio"}
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-md px-3 py-2.5 text-sm text-[#333] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA]"
            />
          </div>
        </div>

        {/* Department */}
        <div className="mb-6">
          <label className="block text-xs text-[#333] mb-1 font-normal">
            {"Departamento (opcional)"}
          </label>
          <input
            type="text"
            placeholder="Ej: 201"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-[240px] border border-[#E0E0E0] rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA]"
          />
        </div>

        {/* Delivery Instructions */}
        <div className="mb-8">
          <label className="block text-xs text-[#333] mb-1 font-normal">
            {"Indicaciones para la entrega (opcional)"}
          </label>
          <textarea
            placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
            value={instructions}
            onChange={(e) => {
              if (e.target.value.length <= 128) setInstructions(e.target.value)
            }}
            rows={3}
            className="w-full border border-[#E0E0E0] rounded-md px-3 py-2.5 text-sm text-[#333] placeholder:text-[#999] outline-none bg-white resize-none focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA]"
          />
          <span className="text-xs text-[#999]">
            {instructions.length} / 128
          </span>
        </div>

        {/* Domicile type */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-[#333] mb-4">Tipo de domicilio</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="domicileType"
                value="residential"
                checked={domicileType === "residential"}
                onChange={() => setDomicileType("residential")}
                className="h-4 w-4 text-[#3483FA] accent-[#3483FA] border-[#E0E0E0]"
              />
              <Home className="h-5 w-5 text-[#333]" />
              <span className="text-sm text-[#333]">Residencial</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="domicileType"
                value="work"
                checked={domicileType === "work"}
                onChange={() => setDomicileType("work")}
                className="h-4 w-4 text-[#3483FA] accent-[#3483FA] border-[#E0E0E0]"
              />
              <Briefcase className="h-5 w-5 text-[#333]" />
              <span className="text-sm text-[#333]">Laboral</span>
            </label>
          </div>
        </div>

        <hr className="border-[#EEEEEE] mb-6" />

        {/* Contact data */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-[#333] mb-1">Datos de contacto</h3>
          <p className="text-sm text-[#999] mb-4">
            Te llamaremos si hay un problema con la entrega.
          </p>

          <div className="mb-4">
            <label className="block text-xs text-[#333] mb-1 font-normal">
              Nombre y apellido
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                errors.fullName ? "border-[#F23D4F]" : "border-[#E0E0E0]"
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-[#F23D4F] mt-1">Este campo es obligatorio</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs text-[#333] mb-1 font-normal">{"Telefono"}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-[#333] outline-none bg-white focus:border-[#3483FA] focus:ring-1 focus:ring-[#3483FA] ${
                errors.phone ? "border-[#F23D4F]" : "border-[#E0E0E0]"
              }`}
            />
            {errors.phone && (
              <span className="text-xs text-[#F23D4F] mt-1">Este campo es obligatorio</span>
            )}
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
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
