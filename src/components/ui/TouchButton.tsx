//  src/components/ui/TouchButton.tsx

"use client"

interface TouchButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export default function TouchButton({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  className = "",
  fullWidth = false
}: TouchButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        px-4 py-3 rounded-lg font-medium
        active:scale-95 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        min-h-[44px] min-w-[44px] /* Touch target size */
        ${className}
      `}
    >
      {children}
    </button>
  )
}