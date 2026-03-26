import { motion } from "framer-motion"

export function GlassBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, transparent 70%)",
          filter: "blur(60px)", top: "-10%", left: "-10%",
        }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, transparent 70%)",
          filter: "blur(80px)", top: "30%", right: "-20%",
        }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
          filter: "blur(70px)", bottom: "-5%", left: "20%",
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 pointer-events-none"
        style={{
          width: "200%", height: "100px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "rotate(-35deg)", top: "20%", left: "-50%",
        }}
        animate={{ left: ["-50%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />
    </>
  )
}
