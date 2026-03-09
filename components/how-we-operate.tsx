export default function HowWeOperate() {
  const values = [
    { icon: "❤️", title: "Compassion", description: "We care deeply about every boy's journey" },
    { icon: "🤝", title: "Community", description: "Together, we build stronger bonds" },
    { icon: "⭐", title: "Excellence", description: "We strive for the highest standards" },
    { icon: "🎯", title: "Mission-Driven", description: "Our purpose guides every action" },
  ]

  return (
    <section className=" py-10 md:py-24 bg-secondary dark:bg-gray-800 px-4 [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]">
      <div className="md:max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center">ABOUT THE <span className="text-primary dark:text-[#8bc97f]">TAE TAE FOUNDATION</span></h2>
        <p className="text-sm lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed text-left  max-w-5xl mx-auto">
          The TaeTae Foundation is committed to nurturing the boy-child through comprehensive development programs designed to instill discipline, curiosity, and self-belief.<br/> We create safe spaces and structured mentorship that guide boys toward becoming responsible, confident young men prepared to make a difference in their communities.
        </p>
      </div>
      {/* <div className="max-w-6xl lg:p-24 p-5 bg-[#e8f5e6] dark:bg-gray-800 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">How We Operate</h2>
        <p className="text-center text-foreground mb-12 max-w-2xl mx-auto">
          Our mentorship approach focuses on developing the whole person through practical skills, academic support, and
          athletic growth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="bg-card dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-border hover:border-primary hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="font-bold text-lg text-primary mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  )
}
