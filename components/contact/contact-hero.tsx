"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function ContactHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-[#e8f5e6] dark:bg-gray-900 overflow-hidden pt-20">
      <div className="container mx-auto px-4 lg:py-20 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
              Let's Start a <span className="text-[#76b569] dark:text-[#8bc97f]">Conversation</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Have questions or want to get involved? We'd love to hear from you. Reach out and let's make a difference
              together.
            </p>

          </motion.div>

          {/* Right - Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="bg-linear-to-br from-[#76b569] to-[#5a8d4f] dark:from-[#8bc97f] dark:to-[#76b569] rounded-3xl p-12 text-white">
              <MessageCircle size={64} className="mb-6" />
              <h3 className="text-3xl font-bold mb-4">We're Here to Help</h3>
              <p className="text-white/90 text-lg">
                Whether you want to volunteer, donate, or learn more about our programs, we're ready to connect.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
