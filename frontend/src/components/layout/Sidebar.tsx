import { useAppStore } from '../../store';
import type { PillarView } from '../../types';

const NAV_ITEMS: { id: PillarView; glyph: string; label: string; sublabel: string }[] = [
  { id: 'search', glyph: '◈', label: 'SEARCH', sublabel: 'Semantic Discovery' },
  { id: 'assistant', glyph: '⬡', label: 'ASSISTANT', sublabel: 'RAG Chat' },
  { id: 'safety', glyph: '⚠', label: 'SAFETY CHECK', sublabel: 'Interaction Checker' },
  { id: 'graph', glyph: '◎', label: 'GRAPH', sublabel: 'Knowledge Visualizer' },
  { id: 'alternatives', glyph: '⟡', label: 'ALTERNATIVES', sublabel: 'Drug Substitutes' },
];

export function Sidebar() {
  const { activeView, setActiveView, watchlist, removeFromWatchlist, checkerDrugs, removeCheckerDrug } = useAppStore();

  return (
    <aside
      className="animate-slide-left"
      style={{
        width: 240,
        minWidth: 240,
        height: '100%',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--accent-dim)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid var(--accent-dim)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--accent-bio)',
            letterSpacing: '0.12em',
            marginBottom: 2,
          }}
        >
          DRUGGRAPH
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          CLINICAL INTELLIGENCE v2.4.1
        </div>
      </div>

      <nav style={{ padding: '12px 8px', flex: '0 0 auto' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.14em',
            padding: '0 8px',
            marginBottom: 8,
          }}
        >
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 10px',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(0,229,195,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent-bio)' : '2px solid transparent',
                marginBottom: 2,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,229,195,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  color: isActive ? 'var(--accent-bio)' : 'var(--text-muted)',
                  lineHeight: 1,
                  width: 20,
                  textAlign: 'center',
                }}
              >
                {item.glyph}
              </span>
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 11,
                    color: isActive ? 'var(--accent-bio)' : 'var(--text-secondary)',
                    letterSpacing: '0.1em',
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    marginTop: 1,
                  }}
                >
                  {item.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Safety Section */}
        <div
          style={{
            borderTop: '1px solid var(--accent-dim)',
            padding: '12px 0 8px',
            flex: '1 1 50%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              padding: '0 16px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>SAFETY ANALYSIS</span>
            <span style={{ color: 'var(--accent-bio)' }}>{checkerDrugs.length}/10</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
            {checkerDrugs.length === 0 ? (
              <div
                style={{
                  padding: '8px 8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                  border: '1px dashed var(--accent-dim)',
                  borderRadius: 4,
                  margin: '0 8px'
                }}
              >
                No compounds selected
              </div>
            ) : (
              checkerDrugs.map((drug, idx) => (
                <div
                  key={`checker-${drug}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 10px',
                    borderRadius: 4,
                    marginBottom: 2,
                    background: 'rgba(0, 229, 195, 0.05)',
                    border: '1px solid rgba(0, 229, 195, 0.1)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-bio)', textTransform: 'uppercase' }}>
                    {drug}
                  </div>
                  <button
                    onClick={() => removeCheckerDrug(drug)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Watchlist Section */}
        <div
          style={{
            borderTop: '1px solid var(--accent-dim)',
            padding: '12px 0 8px',
            flex: '1 1 50%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              padding: '0 16px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>WATCHLIST</span>
            <span style={{ color: 'var(--accent-safe)' }}>{watchlist.length}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
            {watchlist.length === 0 ? (
              <div
                style={{
                  padding: '8px 8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                  border: '1px dashed var(--accent-dim)',
                  borderRadius: 4,
                  margin: '0 8px'
                }}
              >
                Watchlist empty
              </div>
            ) : (
              watchlist.map((drug, idx) => (
                <div
                  key={`watch-${drug.id}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 10px',
                    borderRadius: 4,
                    marginBottom: 2,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--accent-dim)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {drug.name}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(drug.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--accent-dim)',
          padding: '10px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span>DB STATUS</span>
          <span style={{ color: 'var(--accent-safe)' }}>● LIVE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>DRUGS INDEXED</span>
          <span style={{ color: 'var(--accent-bio)' }}>19,853</span>
        </div>
      </div>
    </aside>
  );
}
