 //   src/components/admin/StatsCard.tsx 

 interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  color: string
  change?: number
}

export default function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === "number" ? value.toLocaleString("de-DE") : value}
          </p>
          {change !== undefined && (
            <p className={`text-xs mt-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% zum Vormonat
            </p>
          )}
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  )
}