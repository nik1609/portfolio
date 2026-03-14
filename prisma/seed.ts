import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Profile (upsert) ────────────────────────────────────────────────────────
  const existing = await prisma.profile.findFirst()
  const profileData = {
    name: 'Nikhil Kumar',
    title: 'Solution Acceleration Engineer',
    subtitle: 'AI Engineer · LangGraph · MCP Servers · IIT Palakkad',
    bio: 'Software Engineer with 2+ years of experience building production AI systems, LLM applications, and full-stack platforms. Shipped multi-agent pipelines with LangGraph, an MLOps monitoring platform on Azure, and agentic workflows with MCP servers and RAG. Codeforces Specialist (Rating 1510).',
    aboutBio: `<p>I build <strong>production AI systems that move fast and scale</strong>. At Ushur, I architected multi-agent pipelines with <strong>LangGraph and MCP Servers</strong>, cutting a multi-million-dollar enterprise client's intake workflow from <strong>1 week to 15 minutes</strong>. At Tiger Analytics, I shipped a <strong>3-panel streaming AI platform</strong> that contributed to <strong>Databricks Enterprise AI Partner of the Year (2025)</strong>.</p><p>I hold a <strong>B.Tech in Electrical Engineering from IIT Palakkad</strong>. My competitive programming background, <strong>Codeforces Specialist</strong> with 1000+ problems solved, gives me the systems thinking to write clean, efficient code under pressure.</p><p>I thrive at the intersection of <strong>AI engineering and product thinking</strong>, turning ambiguous problems into agentic workflows, full-stack platforms, and tools that developers and enterprises actually ship with.</p>`,
    highlights: JSON.stringify([
      { icon: '⚡', text: 'Reduced enterprise intake from 1 week to 15 minutes with agentic AI at Ushur' },
      { icon: '🏢', text: 'Contributed to Databricks Enterprise AI Partner of the Year (2025) at Tiger Analytics' },
      { icon: '🤖', text: 'Architected MCP Servers, knowledge bases, and multi-agent pipelines in production' },
      { icon: '☁️', text: 'Production deployments on AWS and Azure | Docker, CI/CD, MLOps' },
      { icon: '🎓', text: 'B.Tech Electrical Engineering, IIT Palakkad | CGPA 7.99' },
      { icon: '🏆', text: 'Codeforces Specialist | Rating 1510 | 1000+ DSA problems solved' },
    ]),
    heroRoles: JSON.stringify(['AI Engineer', 'Full-Stack Developer', 'LangGraph Builder', 'Problem Solver', 'MCP Architect']),
    yearsExp: '2+',
    resumeUrl: '/NikhilKumar_resume.pdf',
    email: 'iamnik1609@gmail.com',
    github: 'nik1609',
    linkedin: 'nikhil-kumar-dev',
    leetcode: 'mnik16',
    codeforces: 'mnik16',
    cfRating: '1510',
    problemsSolved: '1000+',
    location: 'Bengaluru, India',
    companies: JSON.stringify([
      { name: 'Ushur', logoUrl: '' },
      { name: 'Tiger Analytics', logoUrl: '' },
      { name: 'Satcard', logoUrl: '' },
    ]),
    orbitalTags: JSON.stringify(['LangGraph', 'Next.js', 'Python', 'TypeScript']),
  }
  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data: profileData })
    console.log('✅ Profile updated')
  } else {
    await prisma.profile.create({ data: profileData })
    console.log('✅ Profile created')
  }

  // ── Experience (delete & recreate) ─────────────────────────────────────────
  await prisma.experience.deleteMany()
  await prisma.experience.createMany({
    data: [
      {
        title: 'Solution Acceleration Engineer | Ushur',
        location: 'Bengaluru, India',
        description:
          'Docker API mocking via Cloudflare Tunnel adopted by 60%+ of team | Automated agent provisioning with local LLMs, cutting build time from 6 hrs to 30 min | Architected MCP Servers and knowledge bases transforming 1-week enterprise workflows to 15 minutes | Maintained 13+ agent production pipelines with stateful orchestration',
        type: 'work',
        date: 'Oct 2025 – Present',
        order: 1,
      },
      {
        title: 'Analyst | Tiger Analytics',
        location: 'Chennai, India',
        description:
          'Built 3-panel streaming AI research platform with Notion-style editing | Agent Builder with drag-and-drop LangGraph canvas for multi-agent pipelines | MLCore Monitoring Dashboard for Azure ML pipelines | Platform contributed to Databricks Enterprise AI Partner of the Year (2025)',
        type: 'work',
        date: 'Dec 2024 – Sep 2025',
        order: 2,
      },
      {
        title: 'Software Developer Intern | Satcard',
        location: 'Remote',
        description:
          'Django backend optimization improving performance by 60% | Automated WhatsApp notification system boosting operational efficiency by 90% | Real-time business metrics dashboard reducing decision time by 40%',
        type: 'work',
        date: 'May 2023 – Jul 2023',
        order: 3,
      },
      {
        title: 'B.Tech, Electrical Engineering | IIT Palakkad',
        location: 'Indian Institute of Technology Palakkad, Kerala',
        description:
          'Graduated with CGPA 7.99/10 | Codeforces Specialist (Rating 1510), 1000+ DSA problems across platforms | Built strong foundation in algorithms, distributed systems, and software engineering',
        type: 'education',
        date: 'Nov 2020 – Jun 2024',
        order: 4,
      },
    ],
  })
  console.log('✅ Experience seeded (4 items)')

  // ── Projects (delete & recreate) ──────────────────────────────────────────
  await prisma.project.deleteMany()
  await prisma.project.createMany({
    data: [
      {
        title: 'CareerGenie',
        description:
          'AI career counseling platform with Google OAuth and real-time streaming chat powered by the Gemini API, serving 500+ users. Features persistent context management with infinite-scroll sessions and auto-generated titles.',
        tags: ['Next.js', 'NextAuth.js', 'TypeScript', 'tRPC', 'Prisma', 'PostgreSQL', 'Gemini API'],
        link: 'https://careergenie.nikhilkumar.info',
        featured: true,
        order: 1,
      },
      {
        title: 'Agent Builder',
        description:
          'No-code platform to design and deploy multi-agent pipelines by dragging and wiring agents, tools, HITL checkpoints, and prompts on a visual canvas. Built on a versioned Registry, DAG Orchestration Engine, and stateless Agent Workers with Redis memory.',
        tags: ['React.js', 'LangGraph', 'FastAPI', 'Redis', 'PostgreSQL', 'WebSockets'],
        link: 'https://github.com/nik1609',
        featured: true,
        order: 2,
      },
      {
        title: 'MockServe',
        description:
          'Lightweight full-stack SaaS API mocking service that lets developers simulate any backend endpoint instantly without infrastructure setup. Built and shipped end-to-end as sole architect.',
        tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'REST API'],
        link: 'https://mockserve.nikhilkumar.info',
        featured: false,
        order: 3,
      },
      {
        title: 'Portfolio Website',
        description:
          'Personal portfolio with dynamic admin CMS, blog editor, and futuristic dark UI. Built with Next.js, Prisma, TipTap, and Framer Motion.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'TipTap', 'Framer Motion'],
        link: 'https://www.nikhilkumar.info/',
        featured: false,
        order: 4,
      },
      {
        title: 'Grammar Checker',
        description:
          'Desktop grammar checking app with tab-based PyQt6 interface, concurrent session support via Python threading, reducing processing time by 35%.',
        tags: ['Python', 'PyQt6', 'OpenAI API'],
        link: 'https://github.com/nik1609/grammar-checker',
        featured: false,
        order: 5,
      },
      {
        title: 'Farmer Dashboard',
        description:
          'Real-time IoT dashboard for farmers with weather forecasting, Google Maps integration, and sensor data visualization for better crop decisions.',
        tags: ['Python', 'Django', 'JavaScript', 'MySQL', 'REST API'],
        link: 'https://drive.google.com/file/d/1EmLyqFwAecNDARuq5aMapLbG0gMc83ir/view',
        featured: false,
        order: 6,
      },
    ],
  })
  console.log('✅ Projects seeded (6 items)')

  // ── Skills (delete & recreate) ─────────────────────────────────────────────
  await prisma.skill.deleteMany()
  await prisma.skill.createMany({
    data: [
      // Languages
      { name: 'C++',           category: 'language', order: 1 },
      { name: 'Python',        category: 'language', order: 2 },
      { name: 'JavaScript',    category: 'language', order: 3 },
      { name: 'TypeScript',    category: 'language', order: 4 },
      { name: 'SQL',           category: 'language', order: 5 },
      // Frontend
      { name: 'React.js',      category: 'frontend', order: 1 },
      { name: 'Next.js',       category: 'frontend', order: 2 },
      { name: 'TypeScript',    category: 'frontend', order: 3 },
      { name: 'Redux/Recoil',  category: 'frontend', order: 4 },
      { name: 'Tailwind CSS',  category: 'frontend', order: 5 },
      // Backend
      { name: 'Python',        category: 'backend', order: 1 },
      { name: 'Django',        category: 'backend', order: 2 },
      { name: 'FastAPI',       category: 'backend', order: 3 },
      { name: 'Node.js',       category: 'backend', order: 4 },
      { name: 'REST / GraphQL',category: 'backend', order: 5 },
      { name: 'tRPC',          category: 'backend', order: 6 },
      { name: 'WebSockets',    category: 'backend', order: 7 },
      { name: 'Zod',           category: 'backend', order: 8 },
      // AI & Agents
      { name: 'LangGraph',          category: 'ai', order: 1 },
      { name: 'LangChain',          category: 'ai', order: 2 },
      { name: 'Multi-Agent Systems',category: 'ai', order: 3 },
      { name: 'RAG',                category: 'ai', order: 4 },
      { name: 'MCP Servers',        category: 'ai', order: 5 },
      { name: 'HITL',               category: 'ai', order: 6 },
      { name: 'Langfuse',           category: 'ai', order: 7 },
      { name: 'OpenAI / Gemini',    category: 'ai', order: 8 },
      // Cloud & DevOps
      { name: 'AWS',      category: 'tools', order: 1 },
      { name: 'Azure',    category: 'tools', order: 2 },
      { name: 'Docker',   category: 'tools', order: 3 },
      { name: 'CI/CD',    category: 'tools', order: 4 },
      { name: 'Vercel',   category: 'tools', order: 5 },
      { name: 'Git',      category: 'tools', order: 6 },
      { name: 'MLOps',    category: 'tools', order: 7 },
      // Databases
      { name: 'PostgreSQL', category: 'database', order: 1 },
      { name: 'MySQL',      category: 'database', order: 2 },
      { name: 'MongoDB',    category: 'database', order: 3 },
      { name: 'Prisma',     category: 'database', order: 4 },
      { name: 'Vector DBs', category: 'database', order: 5 },
      { name: 'Redis',      category: 'database', order: 6 },
      // System Design
      { name: 'HLD / LLD',           category: 'cs', order: 1 },
      { name: 'Distributed Systems', category: 'cs', order: 2 },
      { name: 'Caching (Redis)',      category: 'cs', order: 3 },
      { name: 'Message Queues (Kafka)', category: 'cs', order: 4 },
      { name: 'Sharding',            category: 'cs', order: 5 },
      { name: 'Load Balancing',      category: 'cs', order: 6 },
    ],
  })
  console.log('✅ Skills seeded (45 items)')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
