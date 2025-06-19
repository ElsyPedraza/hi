import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 bg-gray-900 text-center py-2"
        >
          <p className="text-gray-400 text-sm">
            © 2025 HI. Tutti i diritti riservati.
          </p>
        </motion.div>
    </footer>
  )
}
