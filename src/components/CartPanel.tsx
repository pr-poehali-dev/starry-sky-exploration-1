import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SEND_ORDER_URL } from "@/api"
import type { CartItem } from "@/types"

interface CartPanelProps {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  onRemove: (id: string) => void
  onUpdateQty: (id: string, qty: number) => void
}

export function CartPanel({ open, onClose, cart, onRemove, onUpdateQty }: CartPanelProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const total = cart.reduce((s, i) => s + i.priceNum * i.qty, 0)

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !email) {
      setError("Заполните имя, телефон и email")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch(SEND_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, comment, cart }),
      })
      const data = await res.json()
      if (data.ok) {
        setSent(true)
      } else {
        setError("Ошибка отправки. Попробуйте позже.")
      }
    } catch {
      setError("Ошибка соединения. Попробуйте позже.")
    } finally {
      setSending(false)
    }
  }

  const inputClass = `
    w-full rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none transition-all
    focus:ring-2 focus:ring-purple-300 placeholder-gray-400
  `
  const inputStyle = {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.7)",
    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.04)",
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20"
            style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full z-30 flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              borderLeft: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "-8px 0 48px rgba(0,0,0,0.12)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/40">
              <h2 className="text-lg font-bold text-gray-800">🛒 Корзина</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {cart.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Корзина пуста.<br />Найдите шины и добавьте их сюда.
                </div>
              )}

              {/* Cart items */}
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 items-start rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <span className="text-2xl">🛞</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.brand} {item.model}</p>
                    <p className="text-xs text-gray-500">{item.width}/{item.height} R{item.radius}</p>
                    <p className="text-sm font-bold text-purple-700 mt-0.5">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-lg text-gray-600 font-bold flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)" }}
                    >−</button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-lg text-gray-600 font-bold flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)" }}
                    >+</button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="ml-1 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                    >×</button>
                  </div>
                </motion.div>
              ))}

              {/* Total */}
              {cart.length > 0 && (
                <div className="flex justify-between items-center px-1 text-sm font-semibold text-gray-700">
                  <span>Итого:</span>
                  <span className="text-base text-purple-700">
                    {total > 0 ? `${total.toLocaleString("ru")} ₽` : "—"}
                  </span>
                </div>
              )}

              {/* Order form */}
              {cart.length > 0 && !sent && (
                <form onSubmit={handleOrder} className="flex flex-col gap-3 mt-2">
                  <p className="text-sm font-semibold text-gray-700">Оформить заказ</p>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ваше имя" className={inputClass} style={inputStyle}
                  />
                  <input
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Телефон" type="tel" className={inputClass} style={inputStyle}
                  />
                  <input
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email" type="email" className={inputClass} style={inputStyle}
                  />
                  <textarea
                    value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Комментарий (необязательно)"
                    rows={2}
                    className={inputClass + " resize-none"} style={inputStyle}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-2xl py-3 text-sm font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                      boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sending ? "Отправляем..." : "Отправить заказ"}
                  </motion.button>
                </form>
              )}

              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">✅</span>
                  <p className="text-base font-semibold text-gray-800">Заказ отправлен!</p>
                  <p className="text-sm text-gray-500">Мы свяжемся с вами в ближайшее время.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}