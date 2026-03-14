'use client'

import { GitHubCalendar } from 'react-github-calendar'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function GithubCalendar({ username }: { username: string }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-4">
        Contribution Activity
      </p>
      <div className="overflow-x-auto pb-2 contribution-calendar w-full">
        <GitHubCalendar
          username={username}
          colorScheme="dark"
          theme={{ dark: ['#0f172a', '#2e1065', '#5b21b6', '#7c3aed', '#a78bfa'] }}
          blockSize={10}
          blockMargin={3}
          fontSize={11}
          style={{ fontFamily: 'inherit', color: '#64748b' }}
          labels={{ totalCount: '{{count}} contributions in the last year' }}
        />
      </div>
    </motion.div>
  )
}
