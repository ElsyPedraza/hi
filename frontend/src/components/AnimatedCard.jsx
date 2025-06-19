

import { motion } from "framer-motion"
import { useState } from "react"

export default function AnimatedCard({
  title,
  description,
  image,
  gradient = "from-lime-500 to-green-600",
  delay = 0,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
     onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border with flowing effect */}
      <div className="absolute -inset-0.5 rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute h-[500%] w-[500%] animate-border-flow bg-gradient-to-r from-lime-400 via-yellow-400 to-red-500"></div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden rounded-tr-2xl">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} transform rotate-12 scale-150`}></div>
        </div>

        {/* Hero Image */}
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
          <img
            src={image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(title)}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 `}></div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>

        {/* Hover Effect */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} rounded-b-2xl`}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
