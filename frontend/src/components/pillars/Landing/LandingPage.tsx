import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ArrowRight, 
  Database, 
  Search, 
  Zap, 
  ShieldAlert, 
  ChevronRight, 
  Github, 
  Network
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
    <div className="min-h-screen bg-[#04080F] text-[#E2EEF6] overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 lg:px-12 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.4)]">
            <Network className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Dru<span className="text-purple-500">Graph</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-[#7A9BB5] hover:text-[#00E5C3] transition-colors">How it works</a>
          <a href="#features" className="text-sm text-[#7A9BB5] hover:text-[#00E5C3] transition-colors">Features</a>
          <button 
            onClick={handleLaunch}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
          >
            Launch Demo
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
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold mb-8">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
            POWERED BY NEO4J GRAPH RAG
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
            Drug interactions,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">caught before they harm.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-[#7A9BB5] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            DruGraph uses knowledge graph reasoning to detect dangerous drug combinations that flat search misses — giving clinicians instant, multi-hop answers about medication safety.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleLaunch}
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              Start Clinical Query
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={itemVariants} className="mt-20 pt-12 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">19<span className="text-purple-500">k+</span></span>
              <span className="text-xs text-[#3A5570] uppercase tracking-widest mt-2">drugs indexed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">250<span className="text-purple-500">k+</span></span>
              <span className="text-xs text-[#3A5570] uppercase tracking-widest mt-2">interaction pairs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">4<span className="text-purple-500">-hop</span></span>
              <span className="text-xs text-[#3A5570] uppercase tracking-widest mt-2">max graph depth</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">&lt;2<span className="text-purple-500">s</span></span>
              <span className="text-xs text-[#3A5570] uppercase tracking-widest mt-2">avg query time</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4 block">The Problem</span>
            <h2 className="text-4xl font-bold mb-6">Vector search can't reason across relationships.</h2>
            <p className="text-[#7A9BB5] text-lg leading-relaxed font-light mb-8">
              A patient on Warfarin + Aspirin + Ibuprofen has 3 simultaneous interaction risks. Traditional RAG retrieves documents; DruGraph traverses the graph and finds every danger in one query.
            </p>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="bg-red-500/10 p-2.5 rounded-lg">
                  <ShieldAlert className="text-red-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">125,000 Deaths/Year</h4>
                  <p className="text-sm text-[#3A5570]">Preventable ADE deaths in the US annually.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="bg-purple-500/10 p-2.5 rounded-lg">
                  <Activity className="text-purple-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">30% Miss Rate</h4>
                  <p className="text-sm text-[#3A5570]">Interactions missed by flat keyword/vector search.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-[#0D1525] border border-white/5 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute top-4 right-6 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-[#3A5570] font-mono">// CLINICAL QUERY</p>
                <div className="p-3 bg-black/40 rounded-lg border border-purple-500/30 text-purple-300 font-mono text-sm leading-relaxed">
                  "What are the risks of combining Warfarin, Aspirin, and Ibuprofen?"
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-[#3A5570] font-mono">// GRAPH INSIGHT DETECTED</p>
                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Major Interaction</span>
                  </div>
                  <h5 className="font-bold text-white text-sm mb-1">Warfarin + Aspirin</h5>
                  <p className="text-xs text-[#7A9BB5]">Concurrent use significantly increases bleeding risk. Aspirin inhibits platelet aggregation.</p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">Graph reasoning</span>
                  </div>
                  <h5 className="font-bold text-white text-sm mb-1">How it beat vector RAG</h5>
                  <p className="text-xs text-[#7A9BB5]">Required traversing 6 nodes and 3 relationship types that were disconnected in source text.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Grid */}
      <section className="px-6 lg:px-12 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4 block">The Pipeline</span>
          <h2 className="text-4xl font-bold">Natural language ➝ Graph traversal ➝ Safe answer.</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { step: '01', title: 'Ask in plain English', desc: '"Is it safe to take Warfarin with Aspirin for a diabetic patient?"', icon: Search },
            { step: '02', title: 'Schema-aware Cypher', desc: 'LLM reads the live Neo4j schema and generates multi-hop Cypher queries.', icon: Network },
            { step: '03', title: 'Graph Traversal', desc: 'Neo4j traverses Drug ➝ Interaction ➝ Target nodes across all hops.', icon: Database },
            { step: '04', title: 'Generative Synthesis', desc: 'Results fed to LLM for grounding. Zero hallucination guarantee.', icon: Zap }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-[#080E1A] border border-white/5 hover:border-purple-500/30 transition-all relative">
              <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest mb-6 block">Step {item.step}</span>
              <item.icon className="w-8 h-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-sm text-[#3A5570] leading-relaxed">{item.desc}</p>
              {i < 3 && <ChevronRight className="hidden lg:block absolute top-[50%] -right-4 translate-y-[-50%] text-white/10 w-8 h-8 z-10" />}
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="features" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto text-center">
        <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4 block">Technology</span>
        <h2 className="text-4xl font-bold mb-12">Auditable, open, and performant.</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['Neo4j Community', 'LangChain', 'Groq Llama 3', 'FastAPI', 'React + Vite', 'Pydantic v2', 'DrugBank Open'].map((tech) => (
            <div key={tech} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[#7A9BB5] text-sm font-medium hover:bg-white/10 transition-colors cursor-default">
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 lg:px-12 py-32 bg-gradient-to-b from-transparent to-purple-900/10 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to audit clinical risk?</h2>
          <p className="text-[#3A5570] text-lg mb-10 leading-relaxed">
            Launch the clinical intelligence engine and verify multidrug patient profiles in real-time using Neo4j power.
          </p>
          <button 
            onClick={handleLaunch}
            className="px-12 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)]"
          >
            Launch Clinical Engine
          </button>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-[#3A5570]">
          DruGraph · Built with Neo4j + LangChain · Open Source 2026
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-xs text-[#3A5570] hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-xs text-[#3A5570] hover:text-white transition-colors">API Reference</a>
          <a href="#" className="text-xs text-[#3A5570] hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
