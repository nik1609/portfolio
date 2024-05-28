"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
  After earning my degree in <span className="font-medium">Electrical Engineering</span> from <span className="font-medium">IIT Palakkad in 2024 </span>, I found my true passion in programming and decided to focus my career on it. I started my programming journey with <span className="italic">Competitive Programming </span>in college, learning <span className="font-medium">Data Structures and Algorithms</span> and solving over 1000 problems on various online platforms like <span className="italic">Codeforces, LeetCode and CodeStudio</span>. I achieved a maximum rating of <span className="italic">1510 (Specialist)</span> on Codeforces.
</p>
<p className="mb-3">
  After mastering DSA, I shifted my focus to <span className="font-medium">Web Development</span>. I learned the basics of the <span className="font-medium">MERN Stack</span> and completed an internship at <span className="font-medium">"Business Web Solutions"</span>, which significantly boosted my confidence. I then pursued a second internship at an agriculture-based startup <span className="font-medium">"Satcard"</span>, where I was responsible for handling <span className="italic">admin dashboard features</span>. During my final year of college, I continued my internship as part of my BTech final year project. I worked on creating a <span className="italic">farmer dashboard</span>, building the website from scratch in collaboration with various stakeholders. I developed <span className="italic">6 functional cards</span> that provide farmers with real-time data about their fields, aiding in efficient decision-making. This website is currently <span className="font-medium">deployed</span> in its early stages and has <span className="italic">real-time users.</span>
</p>
<p className="mb-3">
  The experience of seeing my projects being used by real users motivated me to further enhance and improve my skills. I am currently focused on mastering the <span className="font-medium">MERN stack</span> and learning <span className="font-medium">TypeScript</span>. My core stack includes <span className="font-medium">React, Next.js, Node.js, and MongoDB</span>. I am also familiar with <span className="font-medium">Python</span> and <span className="font-medium">Django</span>, and I am always eager to learn new technologies. I am currently looking for a <span className="font-medium">full-time position</span> as a <span className="font-medium">Software Developer</span>.
</p>
<p className="mb-3">
  <span className="italic">When I'm not coding</span>, I love reading, playing video games, and learning about <span className="font-medium">finance and philosophy.</span> I am also learning how to edit videos to create content for YouTube.
</p>
    </motion.section>
  );
}
