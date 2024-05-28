import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import farmer_dashboard1Img from "@/public/farmer_dashboard1.png";
import grammarcheckerImg from "@/public/grammarchecker.png";
import homepageekartImg from "@/public/homepageekart.png";
import portfolioImg from "@/public/portfolio.png";
import coursesellingwebsiteImg from "@/public/coursesellingwebsite.png";
import todolistImg from "@/public/todolist.png";
// import farmer_dashboardImg from "@public/farmer_dashboard.png"
export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "12th grade",
    location: "G.N.National Public School, UP",
    description:
      "Completed 12th with a grade of  96%.",
    icon: React.createElement(LuGraduationCap),
    date: "2020",
  },
  {
    title: "BTech, Electrical Engineering",
    location: "Indian Institute of Technology Palakkad, Kerala",
    description:
      "Started studying in College",
    icon: React.createElement(LuGraduationCap),
    date: "2020 - 2024",
  },
  {
    title: "Full-Stack Developer Intern",
    location: "Business Web Solutions, Remote",
    description:
      "During my time here I worked on developing responsive webpages, integrating APIs, and resolving multiple bugs. I worked on designing the shopping cart layout for the website. I used Javascript, CSS, React to handle most of the tasks.",
    icon: React.createElement(CgWorkAlt),
    date: "Jan 2023 - March 2023",
  },
  {
    title: "Software Developer Intern",
    location: "Satcard, Remote",
    description:
      "In this internship my work was mostly concerned with frontend enhancements and backend optimizations. I worked on creating Whatsapp notification feature for the website. I also developed a dynamic 'Reports' page to get a tabular format summary for all key parameters on the    admin side, allowing for quick data analysis and reduced decision-making time. I woked with Python, Django, Javascript, CSS to complete my tasks ",
    icon: React.createElement(CgWorkAlt),
    date: "May 2023 - July 2023",
  },
  {
    title: "BTech Final Year Project",
    location: "Satcard, Kerala",
    description:
      "In My Final Year Project I worked on creating the Farmer side of the Dashboard. The Aim was to provide farmers with real-time data about their crops and fields, offering valuable insights for better decision-making. I Designed and built 6 functional cards serving distinct purposes, including Google Maps integration, weather forecasting, and various graphs for parameters like temperature and pressure.I worked with Python, Django, HTML, CSS, javascript, RESTful API, Canva, to complete the project.",
    icon: React.createElement(CgWorkAlt),
    date: "May 2023 - July 2023",
  },
  {
    title: "BTech, Electrical Engineering",
    location: "Indian Institute of Technology Palakkad, Kerala",
    description:
      "Completed Graduation with a CGPA of 8.02.",
    icon: React.createElement(LuGraduationCap),
    date: "2024",
  },
] as const;

export const projectsData = [
  {
    title: "Farmer Dashboard",
    description:
      "Developed a dashboard to provide farmers with real-time data about their crops and fields, offering valuable insights for better decision-making.",
    tags: ["HTML", "CSS", "JavaScript", "Python", "Django", "MySql"],
    imageUrl: farmer_dashboard1Img,
    link: "https://drive.google.com/file/d/1EmLyqFwAecNDARuq5aMapLbG0gMc83ir/view"
  },
  {
    title: "Portfolio",
    description:
    "Developed a Personal Portfolio website highlighting a diverse range of projects and journey as a full-stack web developer.",
    tags: ["NextJs", "ReactJs", "TypeScript", "Framer-motion", "Tailwind CSS"],
    imageUrl: portfolioImg,
    link: "https://nik1609.github.io/Homepage_ecommerce/"
  },
  {
    title: "Grammar Checker by OpenAI API",
    description:
      "Developed a grammar checking application using PyQt6 and OpenAI API.",
    tags: ["Python", "PyQt6", "OpenAI API"],
    imageUrl: grammarcheckerImg,
    link: "https://github.com/nik1609/grammar-checker"
  },
  {
    title: "Course Selling Website-Admin Dashboard",
    description:
    "Developed a Admin Dashboard for course selling website",
    tags: ["ReactJs", "JWT", "NodeJs", "MongoDB", "ExpressJs"],
    imageUrl: coursesellingwebsiteImg,
    link: "https://course-selling-app-coursera-frontend-b6fza7o98.vercel.app/"
  },
  {
    title: "Todo List",
    description:
    "Developed a Todo List website with Add, Reset, Sort, Cleanup Features",
    tags: ["ReactJs", "JWT", "NodeJs", "MongoDB", "ExpressJs"],
    imageUrl: todolistImg,
    link: "https://nik1609.github.io/to-do-list-using-bootstrap/"
  },
  {
    title: "Homepage of an E-kart website",
    description:
    "Developed homepage of an E-kart website using Html and CSS",
    tags: ["HTML", "CSS", "JavaScript"],
    imageUrl: homepageekartImg,
    link: "https://nik1609.github.io/Homepage_ecommerce/"
  },
] as const;

export const skillsData = [
  "C++",
  "Python",
  "JavaScript",
  "TypeScript",
  "DSA",
  "OOPs",
  "OS",
  "DBMS",
  "Git",
  "GitHub",
  "SQL",
  "MongoDB",
  "HTML",
  "CSS",
  "React",
  "Express",
  "Node.js",
  "Next.js",
  "Bootstrap",
  "Recoil",
  "GraphQL",
  "Django",
  "Framer Motion",
  "RESTful API",
] as const;
