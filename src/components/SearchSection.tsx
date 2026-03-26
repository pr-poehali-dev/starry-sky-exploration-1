import { useState } from "react"
import { motion } from "framer-motion"

const glassCard = {
  background: "rgba(255,255,255,0.5)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.5)",
}

const widths = ["155","165","175","185","195","205","215","225","235","245","255","265","275","285","295","305","315","325"]
const heights = ["30","35","40","45","50","55","60","65","70","75","80"]
const radii = ["13","14","15","16","17","18","19","20","21","22"]
const seasons = [
  { value: "", label: "Все сезоны" },
  { value: "summer", label: "Летние" },
  { value: "winter", label: "Зимние" },
  { value: "allseason", label: "Всесезонные" },
]

interface SearchSectionProps {
  onSearch: (params: Record<string, string>) => void
  loading: boolean
}

export function SearchSection({ onSearch, loading }: SearchSectionProps) {
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [radius, setRadius] = useState("")
  const [season, setSeason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = {}
    if (width) params.width = width
    if (height) params.height = height
    if (radius) params.radius = radius
    if (season) params.season = season
    onSearch(params)
  }

  const selectClass = `
    w-full rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium appearance-none cursor-pointer
    outline-none focus:ring-2 focus:ring-purple-300 transition-all
  `
  const selectStyle = {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.04)",
  }

  return (
    <motion.div
      className="rounded-[24px] p-5"
      style={glassCard}
    >
      <h2 className="text-base font-semibold text-gray-700 mb-4">Параметры шины</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium px-1">Ширина, мм</label>
            <select value={width} onChange={e => setWidth(e.target.value)} className={selectClass} style={selectStyle}>
              <option value="">Любая</option>
              {widths.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium px-1">Высота, %</label>
            <select value={height} onChange={e => setHeight(e.target.value)} className={selectClass} style={selectStyle}>
              <option value="">Любая</option>
              {heights.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium px-1">Радиус, R</label>
            <select value={radius} onChange={e => setRadius(e.target.value)} className={selectClass} style={selectStyle}>
              <option value="">Любой</option>
              {radii.map(r => <option key={r} value={r}>R{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium px-1">Сезонность</label>
            <select value={season} onChange={e => setSeason(e.target.value)} className={selectClass} style={selectStyle}>
              {seasons.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-semibold text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
            boxShadow: "0 4px 24px rgba(124,58,237,0.35), inset 0 1px 1px rgba(255,255,255,0.2)",
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 6px 32px rgba(124,58,237,0.45), inset 0 1px 1px rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Ищем..." : "Найти шины"}
        </motion.button>
      </form>
    </motion.div>
  )
}
