"use client"

import Link from "next/link"
import { ArrowLeft, Trophy, Users, Heart, TrendingUp } from "lucide-react"
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import IconRenderer from "@/components/icon-renderer";
import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/backButton";

export default function SportsPage() {
  const activities = [
    { icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617696/Football_Training_kzedoq.svg", title: "Football Training", 
      short: "Our efforts with the football track focuses on teamwork, discipline, and strategic thinking.",
      rest: " We partner with local clubs and school teams, to help improve the quality of training environments through better equipment, coaching support, and structured development opportunities. At the same time, we identify promising players who show exceptional ability and dedication, helping them refine their skills while encouraging leadership, teamwork, and a strong competitive spirit."},
    { icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617699/Track_and_Field_clhlfx.svg', title: "Athletics", 
      short: "Boys are introduced to proper running techniques, speed development, endurance training, and race discipline.",
      rest: " Our athletics program focuses primarily on sprint and middle-distance development, specially the 100m, 200m, 400m, 800m and Long jump events Through school competitions and structured coaching, participants gradually improve their performance while learning the importance of consistency, resilience, and personal progress as they strive to break their own records.", },
    { icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617656/Combat_Sports_wdixm7.svg', title: "Combat Sport", 
      short: "From experience and research we found that combat sports training teaches discipline, restraint, and self-control while building strength, agility, and mental focus.",
      rest: " Through structured coaching in sports such as boxing, taekwondo, and judo, boys learn to channel their energy positively while respecting opponents and understanding the responsibility that comes with physical ability." },
    { icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617617/Healthy_Living_ckvcrs.svg', title: "Healthy Living", 
      short: "Boys are introduced to the importance of nutrition, physical recovery, and responsible lifestyle habits that support growth and performance.",
      rest: " Healthy living is an essential part of physical development, through partnerships with health professionals and organizations, we encourage balanced diets, proper hydration, and positive wellbeing practices that help participants maintain both physical strength and long-term health as they develop."},
  ]

  const achievements = [
    { metric: "98%", label: "Team Retention" },
    { metric: "120+", label: "Athletes Trained" },
    { metric: "45", label: "Championships Won" },
    { metric: "100%", label: "Leadership Growth" },
  ]

  const [openBenefit, setOpenBenefit] = useState<number | null>(null);

  return (
    <main className="bg-white dark:bg-gray-900">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <BackButton label="Back"/>

        <div className="bg-linear-to-br from-primary/10 via-accent/10 to-background md:h-96 rounded-lg overflow-hidden mb-12 border border-border flex items-center justify-center">
          <div
            className="relative overflow-hidden lg:block shadow-xl"
          >
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570544/freepik__realistic-image-of-young-african-boys-playing-foot__14050_safojl.jpg"
              alt="Support Illustration"
              className="w-full  object-cover"
            />

            {/* Overlay */}
            <div className="absolute hover:bg-black/40 inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-center font-bold lg:text-5xl text-2xl ">
              Sports Program
            </h2>
          </div>
          </div>  
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="lg:text-lg text-sm text-muted-foreground mb-8 leading-relaxed">
              By collaborating with existing sports teams, coaches, and community leaders, we support boys already participating in football, athletics, and combat sports while also creating initiatives to discover new talent. Through school competitions, community events, and local training sessions, we identify promising young athletes and help them grow. We also work with health organizations and industry partners to support proper nutrition, physical development, and overall wellbeing throughout their training journey.
            </p>

            <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-12 bg-secondary dark:bg-gray-800 lg:p-8 p-2 rounded-lg border border-border">
              {achievements.map((item) => (
                <div key={item.metric} className="text-center">
                  <p className="lg:text-3xl text-xl font-bold text-primary ">{item.metric}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div  className="hidden md:block">
              <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                What Boys Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {activities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div
                      key={activity.title}
                      className="dark:bg-gray-800 border border-border p-6 rounded-lg hover:border-primary transition"
                    >
                      <div className="flex gap-4 items-center">
                      <IconRenderer icon={activity.icon} size={32} className="text-primary" />
                      <h3 className="text-xl font-bold text-foreground ">{activity.title}</h3>
                      </div>
                      <p className="text-muted-foreground">
                          {activity.short}
                          {openBenefit === index && activity.rest}
                        </p>

                        {activity.rest && (
                          <button
                            onClick={() =>
                              setOpenBenefit(openBenefit === index ? null : index)
                            }
                            className="text-primary text-sm mt-2 hover:underline"
                          >
                            {openBenefit === index ? "Read less" : "Read more"}
                          </button>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="max-w-7xl mx-auto pb-4 block md:hidden sm:px-6 lg:px-8">
              <div>
                <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  What Boys Learn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3">

                  {activities.map((value, index) => {
                    const Icon = value.icon;

                    return (
                      <div
                        key={index}
                        className={`
                          group py-6 sm:py-8 transition-all duration-300

                          /* MOBILE — horizontal separators between items */
                          ${index !== 0 ? "border-t border-border sm:border-t-0" : ""}

                          /* DESKTOP — vertical separators between columns */
                          ${index !== 0 ? "sm:border-l sm:border-border" : ""}
                        `}
                      >
                        <div className="text-lg items-center flex gap-3 sm:text-2xl font-bold">
                        <div className="mb-4 p-1 rounded-lg bg-primary/10 w-fit">
                          <IconRenderer icon={Icon} size={22} className="text-primary" />
                        </div>

                        <h4 className="text-lg sm:text-2xl font-bold text-foreground mb-3">
                          {value.title}
                        </h4>
                        </div>

                        <p className="text-muted-foreground">
                          {value.short}
                          {openBenefit === index && value.rest}
                        </p>

                        {value.rest && (
                          <button
                            onClick={() =>
                              setOpenBenefit(openBenefit === index ? null : index)
                            }
                            className="text-primary text-sm mt-2 hover:underline"
                          >
                            {openBenefit === index ? "Read less" : "Read more"}
                          </button>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              Impact
            </h2>
            <div className="bg-secondary dark:bg-gray-800 border border-border p-8 rounded-lg">
              <p className="text-foreground text-sm lg:text-base leading-relaxed">
                Sports teach valuable life lessons, hard work pays off, teamwork achieves more, and setbacks lead to
                comebacks. Boys develop resilience, friendship, and a sense of belonging that extends far beyond the
                field.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-secondary dark:bg-gray-800 border border-border p-8 rounded-lg sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Support This Program</h3>
              <p className="text-foreground text-sm mb-6">Help boys develop through sports.</p>
              <div className="space-y-3">
                <Link
                  href="/support/donate?program=sports"
                  className="block w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-center font-semibold hover:bg-primary/90 transition"
                >
                  Donate
                </Link>
                <Link
                  href="/support/sponsor?program=sports"
                  className="block w-full px-4 py-3 border-2 border-primary text-primary rounded-lg text-center font-semibold hover:bg-primary/5 transition"
                >
                  Sponsor
                </Link>
                <Link
                  href="/support/volunteer"
                  className="block w-full px-4 py-3 border-2 border-accent text-accent rounded-lg text-center font-semibold hover:bg-accent/5 transition"
                >
                  Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
