import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldAlert, 
  Github, 
  Network,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../../../store';

const LandingPage: React.FC = () => {
  const { setActiveView } = useAppStore();

  const handleLaunch = () => {
    setActiveView('search');
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
    <div className="min-h-screen bg-[#04080F] text-[#E2EEF6] overflow-x-hidden font-body relative">
      {/* Background Decor - Teal Themed */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-bio)] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Hex Grid Background - Consistent with Dashboard */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] animate-pulse" style={{ backgroundImage: 'radial-gradient(var(--accent-bio) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 lg:px-12 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 border border-[var(--accent-bio)] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,195,0.2)]">
            <Network className="text-[var(--accent-bio)] w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">Dru<span className="text-[var(--accent-bio)]">Graph</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setActiveView('search')} className="text-sm font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">Query Engine</button>
          <button onClick={() => setActiveView('graph')} className="text-sm font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">Graph Visualizer</button>
          <button onClick={() => setActiveView('safety')} className="text-sm font-mono tracking-widest text-[#7A9BB5] hover:text-[var(--accent-bio)] transition-colors uppercase">Safety Auditor</button>
          <button 
            onClick={handleLaunch}
            className="px-5 py-2 border border-[var(--accent-bio)] text-[var(--accent-bio)] rounded-sm text-[11px] font-mono tracking-[0.2em] transition-all hover:bg-[var(--accent-bio)]/10 shadow-[0_0_15px_rgba(0,229,195,0.1)] hover:shadow-[0_0_25px_rgba(0,229,195,0.3)] uppercase"
          >
            Launch System
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-24 max-w-7xl mx-auto text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-bio)]/10 border border-[var(--accent-bio)]/25 text-[var(--accent-bio)] text-[10px] font-mono tracking-[0.2em] mb-12 uppercase">
            <div className="w-1.5 h-1.5 bg-[var(--accent-bio)] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,195,0.8)]" />
            Neural-Graph RAG Infrastructure
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-8">
            Precision Drug<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-bio)] to-blue-400">Intelligence.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-[#7A9BB5] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            DruGraph traverses petabytes of clinical knowledge to detect dangerous drug combinations that traditional RAG misses. Built for clinicians, powered by Graph reasoning.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleLaunch}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-[var(--accent-bio)] text-[var(--accent-bio)] rounded-sm font-mono text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(0,229,195,0.2)] hover:bg-[var(--accent-bio)] hover:text-void uppercase"
            >
              Initialize Query
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-[#7A9BB5] border border-white/10 rounded-sm font-mono text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase">
              <Github className="w-4 h-4" />
              OSS Repository
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={itemVariants} className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-center">Data Assets</span>
              <span className="text-3xl font-display font-bold text-white">19<span className="text-[var(--accent-bio)]">k</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-center">Neural Nodes</span>
              <span className="text-3xl font-display font-bold text-white">250<span className="text-[var(--accent-bio)]">k</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-center">Graph Hops</span>
              <span className="text-3xl font-display font-bold text-white">4<span className="text-[var(--accent-bio)]">-lvl</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-center">Inference</span>
              <span className="text-3xl font-display font-bold text-white">&lt;2<span className="text-[var(--accent-bio)]">s</span></span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Concept Section */}
      <section className="px-6 lg:px-12 py-32 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <span className="text-[10px] font-mono font-bold text-[var(--accent-bio)] uppercase tracking-[0.4em] mb-6 block">CORE DIFFERENTIATOR</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8 leading-tight">Beyond static vector search.</h2>
            <p className="text-[#7A9BB5] text-lg leading-relaxed font-light mb-10">
              Traditional RAG works by retrieving isolated fragments of text. DruGraph's infrastructure understands the **semantic relationship** between compounds, metabolisms, and clinical outcomes.
            </p>
            <div className="space-y-6">
              {[
                { label: 'MULTI-HOP REASONING', value: 'Traverses indirect risks across drug categories.', icon: Network },
                { label: 'ZERO-HALLUCINATION GUARD', value: 'Answers are strictly grounded in Neo4j graph nodes.', icon: ShieldAlert },
                { label: 'REAL-TIME CLINICAL AUDIT', value: 'Instant interaction detection for multi-drug profiles.', icon: Cpu }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="mt-1 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded bg-white/5 border border-white/5 text-[var(--accent-bio)] group-hover:bg-[var(--accent-bio)] group-hover:text-void transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white mb-1 uppercase tracking-widest">{item.label}</h4>
                    <p className="text-sm text-[#3A5570] leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }} 
            viewport={{ once: true }}
            className="w-full bg-[#0D1525] border border-white/5 rounded-sm p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-bio)] opacity-30" />
            <div className="space-y-8">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#3A5570] tracking-[0.2em]">
                <span>CYPHER EXECUTION ENVIRONMENT</span>
                <span className="animate-pulse text-[var(--accent-bio)]">STABLE</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-black/40 rounded border border-[var(--accent-bio)]/20 text-[var(--accent-bio)] font-mono text-xs leading-relaxed">
                  MATCH (d1:Drug {"{name: 'Warfarin'}"})-[r:INTERACTS_WITH]-(d2:Drug) <br/>
                  RETURN d1, d2, r.severity
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="p-4 bg-[var(--accent-danger)]/5 border-l-2 border-[var(--accent-danger)] rounded-sm">
                  <span className="text-[9px] font-mono text-[var(--accent-danger)] uppercase tracking-[0.2em] block mb-2">Major Danger Detected</span>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-display font-bold text-white">WARFARIN + ASPIRIN</span>
                  </div>
                  <p className="text-xs text-[#7A9BB5] font-light">Additive anticoagulant effects detected at Vitamin K reductase node.</p>
                </div>
                
                <div className="p-4 bg-[var(--accent-bio)]/10 border-l-2 border-[var(--accent-bio)] rounded-sm">
                  <span className="text-[9px] font-mono text-[var(--accent-bio)] uppercase tracking-[0.2em] block mb-2">Neural Connection Active</span>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-display font-bold text-white">BIO-THERAPEUTIC GRAPH</span>
                  </div>
                  <p className="text-xs text-[#7A9BB5] font-light">Retrieving pharmacokinetic profiles across 3-hop metabolic pathways.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-32 bg-[var(--accent-bio)]/5 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-bio)]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-8 uppercase tracking-widest">Deploy Inquiry.</h2>
          <p className="text-[#7A9BB5] text-lg mb-12 leading-relaxed font-light">
            Initialize the knowledge graph environment and experience multidrug interaction analysis with sub-second latency.
          </p>
          <button 
            onClick={handleLaunch}
            className="px-16 py-6 bg-[var(--accent-bio)] text-void rounded-sm font-mono font-bold text-sm tracking-[0.3em] transition-all shadow-[0_0_40px_rgba(0,229,195,0.3)] hover:shadow-[0_0_60px_rgba(0,229,195,0.5)] hover:-translate-y-1 uppercase"
          >
            Bootstrap Dashboard
          </button>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40">
        <div className="text-[10px] font-mono text-[#3A5570] tracking-[0.2em] uppercase">
          DruGraph v1.0.4 · Neo4j Engine · Auditable AI · 2026
        </div>
        <div className="flex items-center gap-10">
          <button onClick={() => setActiveView('search')} className="text-[10px] font-mono text-[#3A5570] hover:text-[var(--accent-bio)] transition-colors uppercase tracking-[0.2em]">Safety Docs</button>
          <button onClick={() => setActiveView('graph')} className="text-[10px] font-mono text-[#3A5570] hover:text-[var(--accent-bio)] transition-colors uppercase tracking-[0.2em]">Network API</button>
          <a href="#" className="text-[10px] font-mono text-[#3A5570] hover:text-white transition-colors uppercase tracking-[0.2em]">Repository</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
