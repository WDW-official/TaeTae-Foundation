import Link from "next/link"
import { Heart, Gift, Users, ArrowRight } from "lucide-react"
import IconRenderer from "./icon-renderer"

export default function HowYouSupport() {

  const actions = [
  {
    icon: "💰",
    title: "Donate",
    description:
      "Help fund programmes, training, and development.",
    points: [
      "One-time or monthly giving",
      "Direct impact tracking",
    ],
    gradient: "from-[#eef6ee] to-[#dcebdc]",
    button: {
      text: "Donate Now",
      color: "bg-[#6f9f6f] hover:bg-[#5c8a5c]",
    },
  },
  {
    icon: "🤝",
    title: "Sponsor",
    description:
      "Partner with us to support cohorts and programmes.",
    points: [
      "Brand visibility",
      "Impact reporting dashboard",
    ],
    gradient: "from-[#f1f3f5] to-[#e4e7ea]",
    button: {
      text: "Become a Partner",
      color: "bg-[#d1d5db] hover:bg-[#bfc4cb] text-gray-700",
    },
  },
  {
    icon: "✋",
    title: "Volunteer",
    description:
      "Give your time, skills, and mentorship.",
    points: [
      "Coaching",
      "Teaching",
      "Mentorship",
    ],
    gradient: "from-[#f7f3e8] to-[#efe6c9]",
    button: {
      text: "Join as Volunteer",
      color: "bg-[#e6d8a8] hover:bg-[#d6c88f] text-[#6b5d2e]",
    },
  },
]
  const ways = [
  {
    title: "DONATE",
    description:
      "Help fund programmes, training, and development.",
    points: [
      "One-time or monthly giving",
      "Direct impact tracking",
    ],
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/donate_q97ool.svg",
    href: "/support/donate",
    from: "#eef6ee",
    to: "#dcebdc",
    button: {
      text: "Donate Now",
      color: "#6f9f6f",
    },
  },
  {
    title: "SPONSOR",
    description:
      "Partner with us to support cohorts and programmes.",
    points: [
      "Brand visibility",
      "Impact reporting dashboard",
    ],
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617667/Sponsor_1_goyphq.svg",
    href: "/support/sponsor",
    from: "#f1f3f5",
    to: "#e4e7ea",
    button: {
      text: "Become a Partner",
      color: "#d1d5db",
    },
  },
  {
    title: "VOLUNTEER",
    description:
      "Give your time, skills, and mentorship.",
    points: [
      "Coaching",
      "Teaching",
      "Mentorship",
    ],
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/volunteer_wv40vn.svg",
    href: "/support/volunteer",
    from: "#f7f3e8",
    to: "#efe6c9",
    button: {
      text: "Join as Volunteer",
      color: "#e6d8a8",
    },
  },
]

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="bg-secondary dark:bg-gray-800 py-6 md:py-10 md:[clip-path:polygon(0_10%,100%_0,100%_100%,0_100%)] ">
      <div className="max-w-6xl mx-auto px-4 ">
        <h2 className="font-heading text-4xl md:mt-20 md:text-6xl font-extrabold text-primary mb-8 text-center">HOW YOU CAN <span className="text-gray-800 dark:text-white drop-shadow-">SUPPORT</span> </h2>
        <p className="text-center text-2xl text-foreground  font-light mb-12 max-w-2xl mx-auto">
          There are three ways to support, <b>Donations, Sponsorships, </b>  and <b>Volunteering. </b> Choose what works best for you and support us to make a real difference.
        </p>

        {/* <div className="grid grid-cols-3 md:grid-cols-3 gap-8 mb-12">
          {ways.map((way, idx) => {
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 md:p-8 p-5 rounded-[55px] shadow-lg border-12 border-[#8f8f8f21] hover:border-primary transition-all text-center group"
              >
                <div className="flex items-center rounded-[55px] shadow-[11px] border-2 border-[#e4e4e4] justify-center gap-2 m-3">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/30 rounded-full flex items-center justify-center  m-2 group-hover:bg-primary/20 transition">
                  <IconRenderer icon={way.icon} size={40} className="text-primary" />
                </div>
                  <h3 className="text-2xl dark:text-white font-bold text-gray-600">{way.title}</h3>
                </div>
                  <p className="text-muted-foreground text-sm mb-6">{way.description}</p>
                <Link
                  href={way.href}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gray-800 dark:bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  {way.button}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div> */}
        <div className="grid text-center grid-cols-3 mb-16 gap-3 md:gap-6">
        {ways.map((value, idx) => (
          <div
            key={idx}
            className="md:p-6 p-2 rounded-2xl bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col h-full"
          >
            {/* Content */}
            <div className="flex-1">
              <div className="rounded-full flex items-center justify-center">
                <IconRenderer
                  icon={value.icon}
                  size={40}
                  className="rounded-full p-2 bg-gray-200 mb-3 text-primary"
                />
              </div>

              <h3 className="font-bold md:text-2xl dark:text-white text-gray-900 mb-2">
                {value.title}
              </h3>

              <p className="text-[10px] md:text-xl text-muted-foreground">
                {value.description}
              </p>

              <ul className="text-[10px] md:text-lg hidden md:block text-left text-gray-600 space-y-2 mt-4 mb-6">
                {value.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      style={{ backgroundColor: "#8ea583", marginTop: "10px" }}
                      className="inline-block  mt-2.5 w-2 h-2 rounded-full"
                    ></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <ul className="text-[10px] md:text-lg md:hidden block text-left text-gray-600 space-y-2 mt-4 mb-6">
                {value.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      style={{ backgroundColor: "#8ea583", marginTop: "4px" }}
                      className="inline-block w-1 mt-2.5 h-1 md:w-2 md:h-2 rounded-full"
                    ></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Button */}
            <Link
              href={value.href}
              style={{ backgroundColor: value.button.color, fontSize: "9px" }}
              className="mt-auto flex md:hidden  items-center justify-center gap-2 w-full md:text-[12px]! py-2 rounded-lg font-medium text-gray-900"
            >
              {value.button.text} 
            </Link>
            <Link
              href={value.href}
              style={{ backgroundColor: value.button.color, fontSize: "20px" }}
              className="mt-auto md:flex hidden  items-center justify-center gap-2 w-full md:text-[12px]! py-2 rounded-lg font-medium text-gray-900"
            >
              {value.button.text} 
            </Link>
          </div>
        ))}
      </div>

      </div>
        <div className="bg-linear-to-br from-primary to-[#173510] dark:from-[#0a1421] dark:to-[#0a1421] text-white p-8 md:p-12  text-center md:[clip-path:polygon(0_0,100%_10%,100%_100%,0_100%)]">
          <h3 className="font-heading text-4xl md:text-5xl font-extrabold md:mb-3 mb-10">YOUR CONTRIBUTION MATTERS</h3>
          <div className="grid md:grid-cols-3 grid-cols-1  gap-6 ">
            <div className="relative group w-full h-full md:rounded-4xl rounded-2xl overflow-hidden">

              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770897331/file_00000000484071f48e2a72919353ffa8_3_sg3f1d.svg"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* color overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* word on top */}
              <div className="absolute md:hidden p-5 flex inset-0 items-center justify-center">
                <span className="text-white   text-sm">
                  Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.
                </span>
              </div>

            </div>
         
            <div>
              
              <p className="md:text-lg p-5 text-sm hidden md:flex mb-8 mt-6.25 opacity-90">Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.</p>
            <div className="grid grid-cols-3 gap-6 md:gap-12">
            <div>
              <div className="text-sm md:text-5xl font-bold mb-2">100+</div>
              <div className="text-sm md:text-base">Boys Supported</div>
            </div>
            <div>
              <div className="text-xl md:text-5xl font-bold mb-2">3</div>
              <div className="text-sm md:text-base">Core Programs</div>
            </div>
            <div>
              <div className="text-xl md:text-5xl font-bold mb-2">∞</div>
              <div className="text-sm md:text-base">Possibilities</div>
            </div>
          </div>
            <div className="text-center italic mt-12 text-xl md:text-2xl">Developing Tomorrow's Leaders</div>
          </div>
          <img
            src={"https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770897318/freepik__35mm-film-photography-open-learning-space-with-nig__35804_ulheac.svg"}
            className="w-full hidden md:block rounded-4xl h-full object-cover group-hover:scale-105 transition-transform"
          />
          </div>
        </div>
      </div>
    </section>
  )
}
