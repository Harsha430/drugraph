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

function App() {
  const { activeView } = useAppStore();

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

  return (
    <div className="h-full w-full flex bg-void overflow-hidden relative">
      <div className="scanline-overlay" />
      <HexGrid />
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative z-0">
        <TopBar />
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderActiveView()}
        </div>
      </main>

      <RightDrawer />
      <ToastContainer />
    </div>
  );
}

export default App;
