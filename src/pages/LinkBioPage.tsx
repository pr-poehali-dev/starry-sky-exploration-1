import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchSection } from "@/components/SearchSection"
import { TireCard } from "@/components/TireCard"
import { CartPanel } from "@/components/CartPanel"
import { GlassBackground } from "@/components/GlassBackground"
import { SEARCH_TIRES_URL } from "@/api"
import type { Tire, CartItem } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
}

export function LinkBioPage() {
  const [tires, setTires] = useState<Tire[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const handleSearch = async (params: Record<string, string>) => {
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`${SEARCH_TIRES_URL}?${new URLSearchParams(params)}`)
      const data = await res.json()
      setTires(data.tires || [])
    } catch {
      setTires([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (tire: Tire) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === tire.id)
      if (existing) {
        return prev.map(i => i.id === tire.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...tire, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const totalCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <main className="relative min-h-screen px-4 py-8 flex flex-col overflow-hidden">
      <GlassBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-2xl w-full flex flex-col gap-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">🔍 ШинПоиск</h1>
            <p className="text-sm text-gray-500 mt-0.5">Подбор шин по параметрам с baza.drom.ru</p>
          </div>
          <motion.button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-700 font-semibold text-sm"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            🛒 Корзина
            {totalCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold"
              >
                {totalCount}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <SearchSection onSearch={handleSearch} loading={loading} />
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 gap-3"
            >
              <motion.div
                className="h-10 w-10 rounded-full border-2 border-purple-400 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-gray-500">Ищем шины на drom.ru...</p>
            </motion.div>
          )}

          {!loading && searched && tires.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400 text-sm"
            >
              По вашему запросу ничего не найдено. Попробуйте изменить параметры.
            </motion.div>
          )}

          {!loading && tires.length > 0 && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              <motion.p variants={itemVariants} className="text-xs text-gray-400 px-1">
                Найдено: {tires.length} предложений
              </motion.p>
              {tires.map(tire => (
                <motion.div key={tire.id} variants={itemVariants}>
                  <TireCard tire={tire} onAdd={addToCart} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center text-xs text-gray-400 pb-4">
          Данные с baza.drom.ru · © 2025 ШинПоиск
        </motion.div>
      </motion.div>

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
      />
    </main>
  )
}