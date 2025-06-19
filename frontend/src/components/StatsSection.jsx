

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function CountUpAnimation({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function StatsSection() {
  const stats = [
    { number: 50000, label: "Visitatori Felici", suffix: "+" },
    { number: 15, label: "Attrazioni Uniche", suffix: "" },
    { number: 25, label: "Anni di Esperienza", suffix: "" },
    { number: 98, label: "Soddisfazione Cliente", suffix: "%" },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-white/5 rounded-full -bottom-32 -right-32"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">I Nostri Numeri Parlano</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Anni di esperienza e migliaia di sorrisi ci rendono il parco preferito delle famiglie
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
            >
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CountUpAnimation end={stat.number} />
                  {stat.suffix}
                </motion.div>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
