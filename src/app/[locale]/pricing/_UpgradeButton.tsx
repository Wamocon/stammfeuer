'use client'

interface UpgradeButtonProps {
  label: string
}

export default function UpgradeButton({ label }: UpgradeButtonProps) {
  return (
    <button
      type="button"
      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-4 rounded-xl text-center transition-colors text-lg"
      onClick={() => alert('Zahlung folgt in Kürze - wir benachrichtigen dich!')}
    >
      {label}
    </button>
  )
}
