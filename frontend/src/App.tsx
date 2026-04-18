import { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { RightDrawer } from './components/layout/RightDrawer';
import { ToastContainer } from './components/layout/ToastContainer';
import { HexGrid } from './components/layout/HexGrid';
import { SearchView } from './components/pillars/Search/SearchView';
import { AssistantView } from './components/pillars/Assistant/AssistantView';
import { SafetyView } from './components/pillars/Safety/SafetyView';
import { GraphView } from './components/pillars/Graph/GraphView';
import AlternativesView from './components/pillars/Alternatives/AlternativesView';
import LandingPage from './components/pillars/Landing/LandingPage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { activeView } = useAppStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'search':
        return <SearchView />;
      case 'assistant':
        return <AssistantView />;
      case 'safety':
        return <SafetyView />;
      case 'graph':
        return <GraphView />;
      case 'alternatives':
        return <AlternativesView />;
      default:
        return <SearchView />;
    }
  };

  if (activeView === 'landing') {
    return (
      <div className="h-full w-full bg-void overflow-auto relative">
        <div className="scanline-overlay" />
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex bg-void overflow-hidden relative">
      <div className="scanline-overlay" />
      <HexGrid />
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative z-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <RightDrawer />
      <ToastContainer />
    </div>
  );
}

export default App;
