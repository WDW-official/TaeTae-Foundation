import { Facebook, Instagram, Linkedin, Twitter, MapPin, Mail, Phone, Clock } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#2f5129] dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* About */}
          <div>
            <img
              src="/Tae-Tae-logo.png"
              alt="TaeTae Foundation Logo"
              className="md:h-10 h-8 w-auto"
            />
            <p className="text-white/80 leading-relaxed mb-4">
              Empowering boys to grow into responsible men through sports, education, 
              skill acquisition, and mentorship.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1CsbxtFyeg/?mibextid=wwXIfr"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#76b569] dark:hover:bg-[#8bc97f] flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/taetaefound?s=11"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#76b569] dark:hover:bg-[#8bc97f] flex items-center justify-center transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/taetaefoundation?igsh=dmZucTduOTlwY3ls"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#76b569] dark:hover:bg-[#8bc97f] flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/taetaefoundation/"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#76b569] dark:hover:bg-[#8bc97f] flex items-center justify-center transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg text-primary font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-white/80 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg text-primary font-bold mb-4">Our Programs</h4>
            <ul className="space-y-2">
              <li className="text-white/80">Sports Development</li>
              <li className="text-white/80">Education & Literacy</li>
              <li className="text-white/80">Skills Acquisition</li>
              <li className="text-white/80">Mentorship Programs</li>
            </ul>
          </div>

          {/* NEW — Contact Info */}
          <div>
            <h4 className="text-lg text-primary font-bold mb-4">Contact Info</h4>

            <ul className="space-y-4 text-white/80">

              <li className="flex items-start gap-3">
                <MapPin size={20} />
                <span>
                  16 Opebi Road, Ikeja, 
                  <br /> Lagos, Nigeria
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={20} />
                <span>
                  info@taetaefoundation.org  
                  
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={20} />
                <span>+234 (000) 000 0000</span>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t text-sm border-white/10 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} TaeTae Foundation. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
