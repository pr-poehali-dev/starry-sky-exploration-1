import { motion } from "framer-motion"
import type { Tire } from "@/types"

const seasonLabel: Record<string, string> = {
  summer: "☀️ Летние",
  winter: "❄️ Зимние",
  allseason: "🌤 Всесезонные",
}

interface TireCardProps {
  tire: Tire
  onAdd: (tire: Tire) => void
}

export function TireCard({ tire, onAdd }: TireCardProps) {
  return (
    <motion.div
      className="group relative flex items-center gap-4 rounded-[20px] px-4 py-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.07)",
        border: "1px solid rgba(255,255,255,0.5)",
      }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[50%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
          borderRadius: "20px 20px 0 0",
        }}
      />

      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{
          background: "rgba(255,255,255,0.8)",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,1), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        🛞
      </div>

      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[15px] font-semibold text-gray-800 tracking-tight">
            {tire.brand} {tire.model}
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}>
            {seasonLabel[tire.season] || tire.season}
          </span>
        </div>
        <p className="text-[12px] text-gray-500 mt-0.5">
          {tire.width}/{tire.height} R{tire.radius} · {tire.condition} · {tire.seller}
        </p>
      </div>

      <div className="relative flex flex-col items-end gap-2 shrink-0">
        <span className="text-[16px] font-bold text-gray-800">{tire.price}</span>
        <motion.button
          onClick={() => onAdd(tire)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 2px 10px rgba(124,58,237,0.3)",
          }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          В корзину
        </motion.button>
      </div>
    </motion.div>
  )
}
