'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiSend, FiMail, FiMapPin } from 'react-icons/fi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { sendEmail } from '@/actions/sendEmail'

interface Profile {
  email?: string
  github: string
  linkedin: string
  location: string
}

export default function Contact({ profile }: { profile: Profile }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const { error } = await sendEmail(formData)
      if (error) {
        toast.error(error)
      } else {
        toast.success("Message sent! I'll get back to you soon.")
        ;(e.target as HTMLFormElement).reset()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-14">
            <div>
              <p className="section-num mb-1">07 / Contact</p>
              <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
                Get in touch
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Info */}
            <div>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                I'm open to full-time SDE roles, freelance projects, and interesting collaborations.
                Feel free to reach out — I respond within 24 hours.
              </p>

              <div className="space-y-4 mb-8">
                {profile.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 glass border-glow rounded-xl flex items-center justify-center text-violet-400 flex-shrink-0">
                      <FiMail />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                      <a href={`mailto:${profile.email}`} className="text-slate-300 hover:text-violet-300 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 glass border-glow rounded-xl flex items-center justify-center text-violet-400 flex-shrink-0">
                    <FiMapPin />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-slate-300">{profile.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 glass border-glow rounded-xl text-slate-400 hover:text-slate-200 hover:border-violet-500/40 transition-all duration-300 text-sm"
                >
                  <FaGithub className="text-lg" /> GitHub
                </a>
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 glass border-glow rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-300 text-sm"
                >
                  <FaLinkedin className="text-lg" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <form onSubmit={handleSubmit} className="glass border-glow rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    name="senderName"
                    required
                    placeholder="Your name"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    name="senderEmail"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><FiSend /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
