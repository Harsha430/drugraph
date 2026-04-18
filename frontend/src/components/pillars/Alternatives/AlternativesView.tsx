import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle, Pill } from 'lucide-react';
import { api } from '../../../services/api';
import { useAppStore } from '../../../store';
import type { AlternativesResponse } from '../../../types';

export default function AlternativesView() {
  const [drug, setDrug] = useState('');
  const [condition, setCondition] = useState('');
  const [currentMeds, setCurrentMeds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<AlternativesResponse | null>(null);
  const { addToast } = useAppStore();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async () => {
    if (!drug.trim() || !condition.trim()) {
      setError('Please enter both drug name and condition');
      addToast('Missing required fields', 'warning');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    addToast(`Searching alternatives for ${drug}...`, 'info');

    try {
      const data = await api.getAlternatives(drug.trim(), condition.trim(), currentMeds.trim());
      setResults(data);
      addToast(`Found ${data.alternatives.length} alternatives`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch alternatives';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const getConflictColor = (conflicts: number) => {
    if (conflicts === 0) return 'var(--accent-safe)';
    if (conflicts <= 2) return 'var(--accent-warm)';
    return 'var(--accent-danger)';
  };

  const getConflictBg = (conflicts: number) => {
    if (conflicts === 0) return 'rgba(34, 201, 122, 0.08)';
    if (conflicts <= 2) return 'rgba(232, 168, 56, 0.08)';
    return 'rgba(255, 69, 96, 0.08)';
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '16px 12px' : '24px 28px',
        gap: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.16em',
            marginBottom: 12,
          }}
        >
          ⟡ THERAPEUTIC ALTERNATIVES
        </div>

        {/* Search Form */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 6,
            padding: isMobile ? 12 : 20,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                CURRENT DRUG
              </label>
              <input
                type="text"
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Aspirin"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--accent-dim)',
                  borderRadius: 4,
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                CONDITION
              </label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., pain, hypertension"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--accent-dim)',
                  borderRadius: 4,
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              CURRENT MEDICATIONS (OPTIONAL, COMMA-SEPARATED)
            </label>
            <input
              type="text"
              value={currentMeds}
              onChange={(e) => setCurrentMeds(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Warfarin, Metformin"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--accent-dim)',
                borderRadius: 4,
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-bio"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 12,
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                SCANNING KNOWLEDGE GRAPH...
              </>
            ) : (
              <>
                <Pill size={14} />
                FIND ALTERNATIVES
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Header */}
      {results && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: 'var(--accent-bio)' }}>{results.alternatives.length}</span> ALTERNATIVES
            {' FOR '}
            <span style={{ color: 'var(--text-primary)' }}>{results.source_drug.toUpperCase()}</span>
            {' · '}
            <span style={{ color: 'var(--text-secondary)' }}>{results.condition.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Results List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          paddingRight: 4,
        }}
      >
        {error && (
          <div
            className="card"
            style={{
              padding: 20,
              background: 'rgba(255, 69, 96, 0.05)',
              border: '1px solid var(--accent-danger)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={20} color="var(--accent-danger)" />
              <span style={{ color: 'var(--accent-danger)', fontFamily: 'var(--font-display)', fontSize: 13 }}>
                {error}
              </span>
            </div>
          </div>
        )}

        {loading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="card scan-loading"
              style={{ height: 100, animationDelay: `${i * 0.15}s` }}
            />
          ))
        )}

        {results && results.alternatives.length === 0 && (
          <div
            className="card"
            style={{
              padding: 40,
              textAlign: 'center',
              background: 'rgba(0, 229, 195, 0.03)',
              border: '1px dashed var(--accent-dim)',
            }}
          >
            <ShieldCheck size={32} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              NO ALTERNATIVES FOUND
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              No therapeutic alternatives found in the knowledge graph for this combination.
            </p>
          </div>
        )}

        {results && results.alternatives.length > 0 && (
          results.alternatives.map((alt, idx) => (
            <div
              key={alt.id}
              className="card card-sweep animate-fade-in-up"
              style={{
                padding: 20,
                animationDelay: `${idx * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      color: 'var(--accent-bio)',
                      letterSpacing: '0.02em',
                      marginBottom: 6,
                    }}
                  >
                    {alt.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 8,
                    }}
                  >
                    {alt.indication || 'No indication available'}
                  </p>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    ID: {alt.id}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'start' : 'center',
                    gap: isMobile ? 12 : 8,
                    padding: isMobile ? '6px 14px' : '6px 14px',
                    borderRadius: isMobile ? 8 : 20,
                    background: getConflictBg(alt.conflicts),
                    border: `1px solid ${getConflictColor(alt.conflicts)}`,
                    flexShrink: 0,
                    marginTop: isMobile ? 8 : 0,
                  }}
                >
                  {alt.conflicts === 0 ? (
                    <CheckCircle size={14} color={getConflictColor(alt.conflicts)} />
                  ) : (
                    <AlertTriangle size={14} color={getConflictColor(alt.conflicts)} />
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: getConflictColor(alt.conflicts),
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    {alt.conflicts === 0 ? 'SAFE' : `${alt.conflicts} CONFLICT${alt.conflicts > 1 ? 'S' : ''}`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {!results && !error && !loading && (
          <div
            style={{
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: 'var(--accent-bio)',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                SYSTEM READY
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  maxWidth: 500,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Enter a drug name and condition to discover therapeutic alternatives with minimal interaction conflicts.
                The system will query the Knowledge Graph for same-category compounds.
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--accent-dim)',
                borderRadius: 6,
                padding: 20,
                maxWidth: 600,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 10,
                  color: 'var(--accent-bio)',
                  marginBottom: 12,
                  letterSpacing: '0.1em',
                }}
              >
                HOW IT WORKS
              </div>
              <ul
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  listStyle: 'none',
                  padding: 0,
                }}
              >
                <li style={{ marginBottom: 8, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent-bio)' }}>→</span>
                  Finds drugs in the same therapeutic category
                </li>
                <li style={{ marginBottom: 8, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent-bio)' }}>→</span>
                  Filters by indication matching your condition
                </li>
                <li style={{ paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent-bio)' }}>→</span>
                  Ranks by interaction conflicts with current medications
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
