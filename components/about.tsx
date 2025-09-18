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
      <SectionHeading>About Me</SectionHeading>
      
      <p className="mb-3">
        I hold a <span className="font-medium">Bachelor of Technology in Electrical Engineering</span> from the <span className="font-medium">Indian Institute of Technology Palakkad</span>. I am currently working as an <span className="font-medium">Analyst at Tiger Analytics</span>, where I enhance user interfaces and optimize backend processes.
      </p>
      
      <p className="mb-3">
        My programming journey began with <span className="italic">Competitive Programming</span>, where I mastered <span className="font-medium">Data Structures and Algorithms</span> by solving over <span className="font-medium">1000 problems</span> on platforms like <span className="italic">Codeforces, LeetCode, and CodeStudio</span>, achieving a rating of <span className="italic">1510 (Specialist)</span> on Codeforces.
      </p>
      
      <p className="mb-3">
        I specialize in <span className="font-medium">ReactJS, TypeScript, Python, Django, and Tailwind CSS</span>. As a <span className="font-medium">Software Developer Intern at Satcard</span>, I handled admin dashboard features and significantly improved backend performance.
      </p>
      
      <p className="mb-3">
        I am focused on mastering the <span className="font-medium">MERN stack</span> and advancing my knowledge of <span className="font-medium">TypeScript</span>. I aim to apply my expertise in a full-time Software Developer role, contributing to innovative and impactful projects.
      </p>
      
      <p className="mb-3">
        <span className="italic">Outside of coding</span>, I enjoy reading, playing video games, and exploring <span className="font-medium">finance and philosophy</span>.
      </p>
    </motion.section>
  );
}
