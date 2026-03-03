import Image from "next/image"

export function MercadoLibreLogo({
  className = "",
  variant = "full",
}: {
  className?: string
  variant?: "full" | "icon"
}) {
  if (variant === "icon") {
    return (
      <Image
        src="/images/ml-icon.png"
        alt="MercadoLibre"
        width={40}
        height={40}
        className={`rounded-md object-contain ${className}`}
        priority
      />
    )
  }

  return (
    <div className={`flex items-center gap-1.5 shrink-0 ${className}`}>
      <Image
        src="/images/ml-icon.png"
        alt="MercadoLibre"
        width={36}
        height={36}
        className="rounded-md object-contain"
        priority
      />
      <div className="flex flex-col leading-none">
        <span className="text-[#333] text-sm font-normal tracking-tight">mercado</span>
        <span className="text-[#333] text-sm font-bold tracking-tight">libre</span>
      </div>
    </div>
  )
}
