import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { useAppStore } from '../../../store';
import { DrugCard } from './DrugCard';

export function SearchView() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const { addToast } = useAppStore();

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', submittedQuery],
    queryFn: () => api.search(submittedQuery),
    enabled: submittedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    setSubmittedQuery(query);
    addToast(`Querying for "${query}"...`, 'info');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 28px',
        gap: 20,
        overflow: 'hidden',
      }}
    >
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
          ◈ SEMANTIC DISCOVERY
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 4,
            padding: '0 14px',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--accent-bio)',
              marginRight: 10,
              userSelect: 'none',
            }}
          >
            [
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search by drug · condition · mechanism · target..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '14px 0',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              boxShadow: 'none',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--accent-bio)',
              marginLeft: 10,
              marginRight: 12,
              userSelect: 'none',
            }}
          >
            ]
          </span>
          <button
            onClick={handleSearch}
            className="btn-bio"
            style={{ padding: '6px 16px', fontSize: 11, flexShrink: 0 }}
          >
            QUERY
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 10,
            flexWrap: 'wrap',
          }}
        >
          {['Type 2 Diabetes', 'Anticoagulants', 'CYP3A4 inhibitors', 'Antihypertensives', 'NSAIDs'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                setSubmittedQuery(tag);
              }}
              style={{
                background: 'none',
                border: '1px solid var(--accent-dim)',
                borderRadius: 3,
                padding: '3px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-bio)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-bio)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-dim)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

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
          {isFetching ? (
            <span style={{ color: 'var(--accent-bio)' }}>SEARCHING...</span>
          ) : (
            <>
              <span style={{ color: 'var(--text-secondary)' }}>{results.length}</span> RESULTS
              {submittedQuery && ` FOR "${submittedQuery.toUpperCase()}"`}
            </>
          )}
        </div>
        <button
          onClick={() => { setQuery(''); setSubmittedQuery(''); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          CLEAR
        </button>
      </div>

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
        {isFetching ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="card scan-loading"
              style={{ height: 120, animationDelay: `${i * 0.15}s` }}
            />
          ))
        ) : results.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent-bio)', letterSpacing: '0.1em', marginBottom: 8 }}>
                {submittedQuery ? "NO RESULTS FOUND" : "SYSTEM READY"}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                {submittedQuery 
                  ? "We couldn't find a direct match in the clinical KG. Try searching by mechanism (e.g., 'CYP3A4 inhibitor') or therapeutic class." 
                  : "Enter a medical term, drug name, or clinical concept above to begin your exploration."}
              </div>
            </div>

            {!submittedQuery && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  width: '100%',
                  maxWidth: 700,
                }}
              >
                {[
                  { title: '◈ SAFETY ANALYSIS', text: 'Click [CHECK] on cards to build a list and analyze contraindications.' },
                  { title: '◎ GRAPH EXPLORER', text: 'Click [GRAPH] to visualize a drug\'s neighborhood in the Neo4j network.' },
                  { title: '⬡ AI ASSISTANT', text: 'Ask complex clinical questions with RAG-powered explainability.' }
                ].map((step) => (
                  <div key={step.title} className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-bio)', marginBottom: 8 }}>{step.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          results.map((drug, i) => (
            <DrugCard
              key={drug.id}
              drug={drug}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))
        )}
      </div>
    </div>
  );
}
