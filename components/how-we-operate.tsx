import IconRenderer from "./icon-renderer"
export default function HowWeOperate() {
 const values = [
    {
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/content-cost_jx3vw5.svg",
      title: "Discipline",
      description1: "We build structure, consistency, and accountability.",
      description2: "We build structure, consistency, and accountability. Structure, consistency, and accountability the habits that separate potential from greatness.",
      from: "#e8f2ec",
      to: "#dce9e2",
    },
    {
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/lightbulb_yxkud3.svg",
      title: "Curiosity",
      description1: "We encourage learning, exploration, and creativity.",
      description2: "We encourage learning, exploration, and creativity. We encourage exploration and creativity to spark a relentless drive to learn and grow.",
      from: "#ecf0ec",
      to: "#eceeea",
    },
    {
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/confidence_le4ndx.svg",
      title: "Self-Belief",
      description1: "We develop confidence and purpose.",
      description2: "We develop confidence and purpose. We develop confidence and purpose to build a mindset that can overcome any challenge.",
      from: "#f7f6f4",
      to: "#eee1bb",
    },
  ]
  return (
    <>
    <section className=" py-10 md:py-24 bg-secondary dark:bg-gray-800 px-4 [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]">
      <div className="md:max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-6xl font-extrabold mb-4 text-center">ABOUT THE <span className="text-primary dark:text-[#8bc97f]">TAE TAE FOUNDATION</span></h2>
        <p className="text-sm lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed text-left  max-w-5xl mx-auto">
          The TaeTae Foundation is committed to nurturing the boy-child through comprehensive development programs designed to instill discipline, curiosity, and self-belief.<br/> We create safe spaces and structured mentorship that guide boys toward becoming responsible, confident young men prepared to make a difference in their communities.
        </p>
      </div>
    </section>
    <section>
      <div className="max-w-6xl lg:p-24 p-5  dark:bg-gray-800 mx-auto">
        <h2 className="text-2xl md:text-5xl font-bold mb-4 text-center">Our Mission Snapshot.</h2>
        <p className="text-center text-foreground md:mb-12 mb-6 max-w-2xl mx-auto">
          We build structure, consistency, and a strong foundation.
        </p>

        <div className="grid text-center grid-cols-3 gap-3 md:gap-6">
          {values.map((value, idx) => (
            <div
              key={idx}
              style={{
                background: `linear-gradient(to bottom right, ${value.from}, ${value.to})`,
              }}
              className={`md:p-6 p-2 rounded-2xl bg-gradient-to-br from-[#e8f2ec] to-[#dce9e2]" shadow-md border border-gray-100`}
            >
              <div className="  rounded-full flex items-center justify-center   transition">
              <IconRenderer icon={value.icon} size={30} className="text-4xl mb-3 items-center text-primary" />
              </div>
              <h3 className="font-bold md:text-lg text-gray-900 mb-2">{value.title}</h3>
              <p className="text-[10px] md:hidden block text-muted-foreground">{value.description1}</p>
              <p className="text-[10px] hidden md:block text-muted-foreground">{value.description2}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
    </>
  )
}
