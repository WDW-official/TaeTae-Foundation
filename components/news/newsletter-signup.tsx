"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"

export function NewsletterSignup() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 dark:bg-gray-800 bg-green-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-none shadow-2xl bg-linear-to-br  from-[#76b569] to-[#173510] dark:from-gray-800 dark:to-gray-900 ">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="text-white" size={32} />
              </div>
              <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-white/90 mb-8">
                Subscribe to our newsletter and get the latest news, stories, and updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-gray-900 border-none h-12 flex-1"
                />
                <Button className="bg-white text-[#4A90E2] hover:bg-gray-100 h-12 px-8 font-semibold">Subscribe</Button>
              </div>
              <p className="text-sm text-white/70 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
