import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github, 
  Network, 
  Cpu, 
  Clock, 
  AlertCircle, 
  Database, 
  Search, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen, 
  Activity
} from 'lucide-react';
import { useAppStore } from '../../../store';

const LandingPage: React.FC = () => {
  const { setActiveView } = useAppStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-[#04080F] text-[#E2EEF6] overflow-y-auto font-body relative scroll-smooth">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-bio)] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] opacity-10" />
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(var(--accent-bio) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-12 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-[var(--accent-bio)] rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,229,195,0.2)]">
            <Network className="text-[var(--accent-bio)] w-4 h-4" />
          </div>
          <span className="text-lg font-display font-bold tracking-tight">Dru<span className="text-[var(--accent-bio)]">Graph</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('problem')} className="text-xs font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">The Problem</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-xs font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">How it works</button>
          <button onClick={() => scrollTo('live-demo')} className="text-xs font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">Live Demo</button>
          <button onClick={() => scrollTo('features')} className="text-xs font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">Features</button>
          <button 
            onClick={() => setActiveView('search')}
            className="px-4 py-1.5 border border-[var(--accent-bio)] text-[var(--accent-bio)] rounded-sm text-[10px] font-mono tracking-[0.2em] transition-all hover:bg-[var(--accent-bio)] hover:text-void shadow-[0_0_15px_rgba(0,229,195,0.1)] uppercase"
          >
            Launch System
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-24 pb-32 max-w-7xl mx-auto text-center border-b border-white/5">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-bio)]/10 border border-[var(--accent-bio)]/25 text-[var(--accent-bio)] text-[10px] font-mono tracking-[0.2em] mb-10 uppercase">
            <div className="w-1.5 h-1.5 bg-[var(--accent-bio)] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,195,0.8)]" />
            Neural-Graph RAG Infrastructure
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-8">
            Drug interactions,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-bio)] to-cyan-400">caught before they harm.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-[#7A9BB5] max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            DruGraph uses knowledge graph reasoning to detect dangerous drug combinations that flat search misses — giving doctors, pharmacists, and researchers instant, multi-hop answers about medication safety.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setActiveView('search')}
              className="w-full sm:w-auto px-10 py-4 bg-[var(--accent-bio)] text-void rounded-sm font-mono font-bold text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,229,195,0.2)] hover:scale-105 active:scale-95 uppercase"
            >
              Try a live query
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-[#E2EEF6] border border-white/10 rounded-sm font-mono text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase">
              <Github className="w-4 h-4" />
              View on GitHub
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={itemVariants} className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'drugs indexed', value: '14k+' },
              { label: 'interaction pairs', value: '250k+' },
              { label: 'max graph traversal', value: '4-hop' },
              { label: 'avg query time', value: '<2s' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-display font-bold text-white">{stat.value}</span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#3A5570] uppercase mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="px-6 lg:px-12 py-32 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] font-mono font-bold text-[var(--accent-bio)] uppercase tracking-[0.4em] mb-6 block">The problem</span>
            <h2 className="text-4xl font-display font-bold mb-8">Vector search can't reason across relationships.</h2>
            <p className="text-[#7A9BB5] text-lg leading-relaxed font-light mb-10">
              A patient on Warfarin + Aspirin + Ibuprofen has 3 simultaneous interaction risks. Traditional RAG retrieves documents. DruGraph traverses the graph and finds every danger in one query.
            </p>
            <div className="grid gap-6">
              {[
                { title: '125,000 Deaths per year', desc: 'Preventable deaths in the US annually attributed to adverse drug events.', icon: AlertCircle, color: 'var(--accent-danger)' },
                { title: '30% Missed by flat search', desc: 'Drug-drug interactions that require multi-hop traversal are invisible to vector search.', icon: Search, color: 'var(--accent-bio)' },
                { title: '6.7min Avg manual check time', desc: 'Time a pharmacist spends manually cross-referencing a 4-drug profile. DruGraph does it in 2s.', icon: Clock, color: 'var(--accent-warm)' }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 rounded border border-white/5 bg-white/[0.02] items-start">
                  <div className="mt-1 p-2 rounded bg-void border border-white/10" style={{ color: item.color }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-base mb-1 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-[#3A5570] leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full aspect-square bg-[#080E1A] rounded-sm border border-white/5 relative overflow-hidden p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="p-4 bg-void border border-accent-dim rounded-sm">
                  <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-2 font-mono text-[10px] text-[#3A5570]">
                    <p>{'>'} ANALYZING PROFILE: WARFARIN, ASPIRIN, IBUPROFEN</p>
                    <p>{'>'} STATUS: CROSS-REFERENCING DRUGBANK NODES...</p>
                    <div className="h-1 bg-accent-dim rounded flex overflow-hidden">
                      <div className="h-full bg-accent-bio w-[65%] animate-pulse" />
                    </div>
                    <p className="text-accent-bio">{'>'} DETECTED 3-HOP HEMORRHAGIC PATHWAY</p>
                  </div>
                </div>
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-sm">
                  <h5 className="font-display font-bold text-red-400 text-xs mb-1">CRITICAL COLLISION IMMINENT</h5>
                  <p className="text-[10px] text-red-400/60 font-mono">VKORC1 inhibition compounded by NSAID-mediated platelet interference.</p>
                </div>
              </div>
              {/* Floating Graph Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    x: [Math.random() * 20 - 10, Math.random() * 20 - 10], 
                    y: [Math.random() * 20 - 10, Math.random() * 20 - 10] 
                  }}
                  transition={{ duration: 3 + i, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute w-1 h-1 bg-accent-bio rounded-full opacity-20"
                  style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-32 bg-white/[0.02] border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <span className="text-[10px] font-mono font-bold text-[var(--accent-bio)] uppercase tracking-[0.4em] mb-6 block">How it works</span>
          <h2 className="text-4xl font-display font-bold">Natural language → graph traversal → safe answer.</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative px-4">
          {[
            { step: '01', title: 'Ask in plain English', desc: '"Is it safe to take Warfarin with Aspirin and Metformin for a diabetic patient?"', icon: Search },
            { step: '02', title: 'Cypher generation', desc: 'LLM reads the live Neo4j schema and generates a precise multi-hop Cypher query.', icon: Cpu },
            { step: '03', title: 'Graph traversal', desc: 'Neo4j traverses Drug → Interaction → Disease → Contraindication nodes.', icon: Network },
            { step: '04', title: 'Grounded answer', desc: 'Results fed back to LLM as context. Response is fully grounded — no hallucination.', icon: Zap }
          ].map((item, i) => (
            <div key={i} className="group relative">
              <div className="p-10 bg-[#080E1A] border border-white/5 rounded-sm hover:border-[var(--accent-bio)]/30 transition-all h-full flex flex-col items-center text-center">
                <span className="text-xs font-mono font-bold text-[var(--accent-bio)]/40 mb-8 block">STEP {item.step}</span>
                <div className="w-12 h-12 flex items-center justify-center rounded bg-white/5 mb-8 text-[var(--accent-bio)] group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h3 className="text-base font-display font-bold mb-4 text-white uppercase tracking-wider">{item.title}</h3>
                <p className="text-xs text-[#3A5570] leading-relaxed font-light">{item.desc}</p>
              </div>
              {i < 3 && <div className="hidden lg:block absolute top-[50%] -right-4 translate-y-[-50%] text-white/10 z-10"><ChevronRight /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="live-demo" className="px-6 lg:px-12 py-32 max-w-7xl mx-auto border-b border-white/5">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono font-bold text-[var(--accent-bio)] uppercase tracking-[0.4em] mb-4 block text-center">Live demo</span>
          <h2 className="text-4xl font-display font-bold">See a real multi-hop query in action.</h2>
        </div>

        <div className="bg-[#0D1525] border border-white/5 rounded-sm overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="px-10 py-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-bio shadow-[0_0_8px_rgba(0,229,195,0.4)]" />
              <span className="font-mono text-[11px] text-[#7A9BB5] tracking-widest uppercase">Inquiry Interface</span>
            </div>
            <div className="text-[10px] font-mono text-[#3A5570]">LATENCY: 1.84s</div>
          </div>
          <div className="p-10">
            <div className="mb-10">
              <label className="text-[10px] font-mono text-[#3A5570] uppercase tracking-widest mb-4 block">Natural language input</label>
              <div className="p-4 bg-void border border-accent-dim rounded-sm text-[var(--accent-bio)] font-mono text-base italic">
                "What are the risks of combining Warfarin, Aspirin, and Ibuprofen?"
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#3A5570] uppercase tracking-widest mb-4 block">Graph RAG results — 3 interaction pairs detected</label>
              <div className="grid gap-4">
                {[
                  { drugA: 'Warfarin', drugB: 'Aspirin', severity: 'Major', desc: 'Concurrent use significantly increases bleeding risk. Aspirin inhibits platelet aggregation, compounding anticoagulant effect.' },
                  { drugA: 'Warfarin', drugB: 'Ibuprofen', severity: 'Major', desc: 'NSAIDs displace warfarin from plasma proteins, elevating free warfarin concentration and hemorrhagic risk.' },
                  { drugA: 'Aspirin', drugB: 'Ibuprofen', severity: 'Moderate', desc: "Ibuprofen may interfere with Aspirin's cardioprotective effect. Consider timing separation." }
                ].map((risk, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 p-5 rounded border border-white/5 bg-white/[0.01]">
                    <div className="min-w-[100px] flex md:flex-col justify-between items-start">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded ${risk.severity === 'Major' ? 'bg-red-400 text-void' : 'bg-yellow-400 text-void'}`}>
                        {risk.severity}
                      </span>
                      <span className="text-[10px] font-display text-white mt-1 pt-1 md:block hidden uppercase tracking-tighter">{risk.drugA} + {risk.drugB}</span>
                    </div>
                    <p className="text-xs text-[#7A9BB5] leading-relaxed font-light">{risk.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 p-6 bg-accent-bio/5 border-l-2 border-accent-bio rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-accent-bio" />
                <span className="text-[10px] font-mono font-bold text-accent-bio uppercase tracking-widest">Graph insight: Why graph beats vector search</span>
              </div>
              <p className="text-xs text-[#7A9BB5] font-light">This 3-drug risk profile required traversing 6 nodes and 3 relationship types simultaneously — impossible with flat retrieval.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-12 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-mono font-bold text-[var(--accent-bio)] uppercase tracking-[0.4em] mb-4 block">Features</span>
          <h2 className="text-4xl font-display font-bold">Built for real clinical reasoning.</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {[
            { cat: 'Core', title: 'Multi-hop traversal', desc: 'Queries span Drug → Target → Disease in a single Cypher call. Finds risks requiring 4+ hops.', icon: Network },
            { cat: 'Core', title: 'Schema-aware Cypher', desc: 'LLM reads live Neo4j schema on every query. Generation automatically adapts to new data.', icon: Database },
            { cat: 'Core', title: 'Self-correcting queries', desc: 'Every Cypher runs through EXPLAIN. Failures are corrected by LLM automatically.', icon: ShieldCheck },
            { cat: 'Intelligence', title: 'Safe alternative finder', desc: 'Ask for substitutes that don\'t interact with current meds — DruGraph explores the category graph.', icon: BookOpen },
            { cat: 'Intelligence', title: 'Drug profile risk map', desc: 'Input a medication list and get a severity-ranked matrix — critical risks surface first.', icon: Activity },
            { cat: 'Data', title: '14,000+ drugs indexed', desc: 'Sourced from DrugBank Open + RxNav. Covers drugs, categories, targets, and side effects.', icon: Cpu }
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded border border-white/5 bg-[#080E1A] hover:bg-[#0D1525] transition-all">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] mb-6 block ${f.cat === 'Core' ? 'text-accent-bio' : f.cat === 'Intelligence' ? 'text-cyan-400' : 'text-text-muted'}`}>[{f.cat}]</span>
              <f.icon size={26} className="text-[#3A5570] mb-8 group-hover:text-accent-bio transition-colors" />
              <h3 className="text-lg font-display font-bold mb-3 text-white uppercase tracking-wider">{f.title}</h3>
              <p className="text-sm text-[#7A9BB5] leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="px-6 lg:px-12 py-32 bg-white/[0.02] border-t border-white/5 text-center">
        <span className="text-[10px] font-mono font-bold text-[#3A5570] uppercase tracking-[0.4em] mb-12 block">Tech stack: Open source, auditable, no black boxes.</span>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
          {['Neo4j Community', 'LangChain', 'Groq LLM API', 'DrugBank Open Data', 'RxNav API', 'FastAPI', 'React + Vite', 'Pydantic v2'].map(t => (
            <span key={t} className="text-xs font-mono text-[#7A9BB5] uppercase tracking-widest">{t}</span>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="px-6 lg:px-12 py-40 text-center relative overflow-hidden bg-gradient-to-b from-transparent to-[var(--accent-bio)]/5">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--accent-bio)_0%,transparent_70%)] opacity-[0.03]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-10 uppercase tracking-widest">Try DruGraph on your own drug list.</h2>
          <p className="text-lg text-[#7A9BB5] mb-12 leading-relaxed font-light">
            Paste any combination of medications and see exactly what interactions the graph finds — in under 2 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setActiveView('search')}
              className="px-20 py-6 bg-[var(--accent-bio)] text-void rounded-sm font-mono font-bold text-base tracking-[0.3em] transition-all shadow-[0_0_50px_rgba(0,229,195,0.3)] hover:scale-105 uppercase"
            >
              Launch demo
            </button>
            <button className="px-10 py-6 bg-transparent border border-white/10 text-white rounded-sm font-mono text-sm tracking-[0.2em] transition-all flex items-center gap-3 uppercase">
              <BookOpen size={16} />
              Read the docs
            </button>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black/60">
        <div className="text-[10px] font-mono text-[#3A5570] tracking-[0.2em] uppercase">
          DruGraph · Built with Neo4j + LangChain · Open source
        </div>
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2 group">
            <Github size={14} className="text-[#3A5570] group-hover:text-white transition-colors" />
            <span className="text-[10px] font-mono text-[#3A5570] group-hover:text-white transition-colors tracking-widest uppercase">GitHub</span>
          </a>
          <a href="#" className="text-[10px] font-mono text-[#3A5570] hover:text-white transition-colors tracking-widest uppercase">Docs</a>
          <a href="#" className="text-[10px] font-mono text-[#3A5570] hover:text-white transition-colors tracking-widest uppercase">API</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
