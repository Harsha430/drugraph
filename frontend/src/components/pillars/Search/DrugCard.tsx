import { useState, useEffect } from 'react';
import type { Drug } from '../../../types';
import { useAppStore } from '../../../store';
import { Activity, ShieldAlert, Binary, Target, BookmarkPlus } from 'lucide-react';

interface DrugCardProps {
  drug: Drug;
  style?: React.CSSProperties;
}

const STATUS_COLORS: Record<string, string> = {
  approved: 'var(--accent-safe)',
  investigational: 'var(--accent-warm)',
  withdrawn: 'var(--accent-danger)',
  experimental: 'var(--text-secondary)',
};

export function DrugCard({ drug, style }: DrugCardProps) {
  const { openRightDrawer, addToWatchlist, watchlist, setActiveView, addToast, addCheckerDrug, checkerDrugs } = useAppStore();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAnalyzed = checkerDrugs.includes(drug.name);
  const isWatched = watchlist.some(d => d.name === drug.name || d.id === drug.id);

  return (
    <div
      className="card card-sweep animate-fade-in-up"
      style={{
        padding: isMobile ? '12px 16px' : '16px 20px',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: '130px',
        ...style,
      }}
      onClick={() => openRightDrawer(drug)}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              color: 'var(--accent-bio)',
              letterSpacing: '0.08em',
              marginBottom: 2,
            }}
          >
            {drug.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            {(drug.categories || []).length > 0 ? drug.categories.join(' · ') : 'SYSTEM COMPOUND'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
           <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                color: STATUS_COLORS[drug.status] ?? 'var(--text-muted)',
                border: `1px solid ${STATUS_COLORS[drug.status] ?? 'var(--text-muted)'}`,
                padding: '2px 8px',
                borderRadius: 3,
                letterSpacing: '0.1em',
                flexShrink: 0,
              }}
            >
              {(drug.status || 'approved').toUpperCase()}
            </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Activity size={10} style={{ color: 'var(--accent-bio)' }} />
          {drug.interactionCount || 'Live'} 
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Target size={10} style={{ color: 'var(--accent-warm)' }} />
          {drug.targetCount || 'Graph'}
        </span>
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: '1px solid var(--accent-dim)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-end',
          gap: 6,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-bio"
          style={{ 
            padding: '4px 10px', 
            fontSize: 9,
            background: isWatched ? 'rgba(0, 229, 195, 0.1)' : 'transparent',
            color: isWatched ? 'var(--accent-bio)' : 'inherit',
            borderColor: isWatched ? 'var(--accent-bio)' : 'var(--accent-dim)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isWatched) {
              addToast(`${drug.name} already in watchlist`, 'info');
            } else {
              addToWatchlist(drug);
              addToast(`${drug.name} added to watchlist`, 'success');
            }
          }}
        >
          <BookmarkPlus size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
          {isWatched ? 'WATCHED' : 'WATCH'}
        </button>
        <button
          className="btn-bio"
          style={{ 
            padding: '4px 10px', 
            fontSize: 9,
            background: isAnalyzed ? 'rgba(232, 168, 56, 0.1)' : 'transparent',
            color: isAnalyzed ? 'var(--accent-warm)' : 'inherit',
            borderColor: isAnalyzed ? 'var(--accent-warm)' : 'var(--accent-dim)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isAnalyzed) {
               addToast(`${drug.name} already in analysis`, 'info');
            } else {
               addCheckerDrug(drug.name);
               addToast(`${drug.name} added for analysis`, 'success');
               setActiveView('safety');
            }
          }}
        >
          <ShieldAlert size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
          {isAnalyzed ? 'ANALYZING' : 'CHECK'}
        </button>
        <button
          className="btn-bio"
          style={{ padding: '4px 10px', fontSize: 9, borderColor: 'var(--accent-dim)' }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveView('graph');
          }}
        >
          <Binary size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
          GRAPH
        </button>
      </div>
    </div>
  );
}
