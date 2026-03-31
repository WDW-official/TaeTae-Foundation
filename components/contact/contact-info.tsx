"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Foundation Street", "Lagos, Nigeria"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 (904) 0000 551"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@taetaefoundation.org", "support@taetaefoundation.org"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday: 9:00 AM - 5:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
  },
]

export function ContactInfo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="overflow-hidden px-5">
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold dark:text-gray-50 text-gray-900 mb-4">Contact Information</h2>
        <p className="text-lg dark:text-gray-400 text-gray-600 leading-relaxed">
          We're here to answer any questions you may have about our programs, volunteering opportunities, or how you can
          support our mission.
        </p>
      </div>

      <div className="space-y-4">
              {[
                { icon: Mail, label: "Email Us", value: "info@taetaefoundation.org" },
                { icon: Phone, label: "Call Us", value: "+234 (904) 0000 551" },
                { icon: MapPin, label: "Visit Us", value: "16 Opebi Road, Ikeja, Lagos, Nigeria" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#76b569]/10 dark:bg-[#76b569]/20 flex items-center justify-center">
                    <item.icon className="text-[#76b569] dark:text-[#8bc97f]" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

      <Card className="border-none shadow-md bg-linear-to-br from-[#76b569] to-white">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-3">Quick Response</h3>
          <p className="text-gray-600 text-sm">
            We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please
            call us directly.
          </p>
        </CardContent>
      </Card>
    </motion.div>
    </div>
  )
}
