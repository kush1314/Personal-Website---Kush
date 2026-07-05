import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="mb-10 flex flex-col gap-8">
          <button
            onClick={() => nav('/?menu=true')}
            className="text-slate-300 hover:text-white inline-flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back
          </button>

          <div className="rounded-[36px] border border-emerald-500/20 bg-slate-900/80 p-8 shadow-[0_30px_80px_rgba(16,185,129,0.14)] backdrop-blur-lg">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="rounded-[32px] border border-emerald-400/30 bg-slate-950 p-4 shadow-2xl shadow-emerald-500/10"
              >
                <div className="overflow-hidden rounded-[28px] border border-emerald-400/25 bg-black">
                  <img
                    src="/assets/about-photo.png"
                    alt="About me"
                    className="w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="space-y-6"
              >
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">About Me</p>
                <h1 className="text-4xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I love computer science and engineering.
                </h1>
                <p className="text-slate-300 leading-relaxed text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I build polished, interactive experiences that combine thoughtful engineering with clean design. My focus is on making products that feel smart, dependable, and memorable.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Passion', value: 'CS + Engineering' },
                    { label: 'Style', value: 'Interactive polish' },
                    { label: 'Stack', value: 'React, Vite, Tailwind' },
                    { label: 'Vision', value: 'Recruiter-ready impact' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">{item.label}</p>
                      <p className="mt-3 text-sm text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="rounded-[36px] border border-emerald-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-500/10"
          >
            <h2 className="text-3xl font-semibold text-white mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Why this section stands out
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              This layout is built to impress recruiters with clean structure, bold messaging, and a polished visual tone. It signals that you care about both engineering quality and user experience.
            </p>
            <div className="space-y-4">
              {[
                'Interactive motion and bold visual hierarchy',
                'Strong messaging around computer science and engineering',
                'Room for a future video walkthrough without clutter',
                'Refined visuals that show care for brand and detail'
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-950/80 p-5 border border-slate-800">
                  <p className="text-slate-200 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
            className="rounded-[36px] border border-emerald-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-500/10"
          >
            <p className="text-emerald-400 uppercase tracking-[0.28em] text-xs mb-4">Highlight</p>
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              I love computer science and engineering.
            </h3>
            <p className="text-slate-300 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              This page is ready for a strong recruiter impression: polished visuals, an interactive hero image, and a clear message about your technical strengths.
            </p>
            <div className="rounded-3xl border border-emerald-500/10 bg-slate-950/90 p-5">
              <p className="text-slate-100 text-sm font-medium">Future video placeholder</p>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                When you add a video link, this section will be a great place to feature it among your skills and personal story.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
