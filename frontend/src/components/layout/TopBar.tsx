import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { Menu } from 'lucide-react';
import type { PillarView } from '../../types';

const VIEW_LABELS: Record<string, string[]> = {
  search: ['DRUGGRAPH', 'SEMANTIC DISCOVERY'],
  assistant: ['DRUGGRAPH', 'CLINICAL ASSISTANT'],
  safety: ['DRUGGRAPH', 'SAFETY CHECKER'],
  graph: ['DRUGGRAPH', 'KNOWLEDGE GRAPH'],
};

export function TopBar() {
  const { activeView, setActiveView, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const drugCount = useAnimatedCounter(19853, 2000, 600);
  const labels = VIEW_LABELS[activeView] ?? ['DRUGGRAPH'];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className="animate-fade-in"
      style={{
        height: 48,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--accent-dim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 20px',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 8 }}>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-bio)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
            }}
          >
            <Menu size={20} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {labels.map((label, i) => (
            <span key={i} style={{ display: i === 0 && isMobile ? 'none' : 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && (
                <span style={{ color: 'var(--accent-dim)', fontFamily: 'var(--font-display)', fontSize: 12 }}>
                  /
                </span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: i === 0 ? 11 : 12,
                  color: i === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                  letterSpacing: '0.1em',
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 20 }}>
        {!isMobile && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ color: 'var(--accent-bio)' }}>
              {drugCount.toLocaleString()}
            </span>{' '}
            DRUGS INDEXED
          </div>
        )}

        <div style={{ display: 'flex', gap: 4 }}>
          {(isMobile ? (['search', 'assistant'] as PillarView[]) : (['search', 'assistant', 'safety', 'graph'] as PillarView[])).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                background: 'none',
                border: activeView === view ? '1px solid var(--accent-bio)' : '1px solid var(--accent-dim)',
                borderRadius: 3,
                padding: '3px 6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                color: activeView === view ? 'var(--accent-bio)' : 'var(--text-muted)',
                letterSpacing: '0.1em',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
