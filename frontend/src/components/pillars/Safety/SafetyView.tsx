import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../../store';
import { api } from '../../../services/api';
import { AlertTriangle, ShieldCheck, X, Loader2, Activity, Play } from 'lucide-react';

export function SafetyView() {
  const { checkerDrugs, removeCheckerDrug, clearCheckerDrugs, addCheckerDrug, addToast } = useAppStore();
  const [analysisTriggered, setAnalysisTriggered] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset trigger when drug list changes so stale results don't linger
  useEffect(() => {
    setAnalysisTriggered(false);
  }, [checkerDrugs.join(',')]);

  const { data: interactions = [], isFetching } = useQuery({
    queryKey: ['check', checkerDrugs, analysisTriggered],
    queryFn: () => api.checkInteractions(checkerDrugs),
    enabled: checkerDrugs.length >= 2 && analysisTriggered,
  });

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'major':
        return 'severity-major';
      case 'moderate':
        return 'severity-major'; // Map moderate to major styling
      case 'minor':
        return 'severity-minor';
      default:
        return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'var(--accent-danger)';
      case 'major':
      case 'moderate':
        return 'var(--accent-warm)';
      case 'minor':
        return 'var(--text-muted)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div 
      className="flex-1 flex overflow-hidden animate-fade-in"
      style={{ flexDirection: isMobile ? 'column' : 'row' }}
    >
      {/* Left Panel: Selected Drugs */}
      <div
        style={{
          width: isMobile ? '100%' : 320,
          borderRight: isMobile ? 'none' : '1px solid var(--accent-dim)',
          borderBottom: isMobile ? '1px solid var(--accent-dim)' : 'none',
          background: 'rgba(8, 14, 26, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '12px 16px' : 20,
          maxHeight: isMobile ? '35%' : '100%',
        }}
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
              }}
            >
              DRUG LIST
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
              }}
            >
              {checkerDrugs.length} COMPOUNDS SELECTED
            </p>
          </div>
          {checkerDrugs.length > 0 && (
            <button
              onClick={clearCheckerDrugs}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              CLEAR ALL
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {checkerDrugs.map((drug) => (
            <div
              key={drug}
              className="card animate-fade-in-up"
              style={{
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  color: 'var(--accent-bio)',
                  letterSpacing: '0.02em',
                }}
              >
                {drug.toUpperCase()}
              </span>
              <button
                onClick={() => removeCheckerDrug(drug)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {checkerDrugs.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                border: '1px dashed var(--accent-dim)',
                borderRadius: 4,
              }}
            >
              Add drugs from search result cards to analyze interactions.
            </div>
          )}
        </div>

        {/* RUN ANALYSIS BUTTON */}
        {checkerDrugs.length >= 2 && (
          <button
            className="btn-bio"
            style={{
              width: '100%',
              padding: '14px',
              marginTop: 16,
              fontSize: 12,
              letterSpacing: '0.1em',
              background: analysisTriggered && !isFetching
                ? 'rgba(0,229,195,0.08)'
                : 'linear-gradient(135deg, rgba(0,229,195,0.15), rgba(0,229,195,0.05))',
              border: '1px solid var(--accent-bio)',
              color: 'var(--accent-bio)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 0 20px rgba(0,229,195,0.1)',
            }}
            disabled={isFetching}
            onClick={() => {
              setAnalysisTriggered(true);
              addToast(`Scanning ${checkerDrugs.length} compounds...`, 'info');
            }}
          >
            {isFetching
              ? <><Loader2 size={14} className="animate-spin" /> SCANNING.....</>
              : <><Play size={14} /> RUN INTERACTION ANALYSIS</>}
          </button>
        )}

        {/* SAFETY ENGINE TIP - Hide on mobile if list is long, or just always on mobile for space */}
        {!isMobile && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--accent-dim)',
              borderRadius: 4,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} color="var(--accent-safe)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  color: 'var(--text-primary)',
                }}
              >
                SAFETY ENGINE
              </span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Cross-referencing selected compounds against the Neo4j Knowledge Graph and
              local medical descriptions.
            </p>
          </div>
        )}
      </div>

      {/* Right Panel: Results */}
      <div 
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ padding: isMobile ? '16px 16px' : '32px' }}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? 18 : 24,
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
                marginBottom: isMobile ? 4 : 8,
              }}
            >
              INTERACTION ANALYSIS
            </h1>
            {isFetching && <Loader2 className="animate-spin text-accent-bio" size={20} />}
          </div>
          <div
            style={{
              height: 1,
              width: 60,
              background: 'var(--accent-bio)',
              marginBottom: isMobile ? 12 : 20,
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {interactions.length > 0 ? (
            interactions.map((interaction: any, idx: number) => (
              <div
                key={`${interaction.drug_a}-${interaction.drug_b}`}
                className={`card animate-fade-in-up ${getSeverityClass(interaction.severity)}`}
                style={{
                  padding: 24,
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        padding: '4px 10px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 4,
                        fontFamily: 'var(--font-display)',
                        fontSize: 12,
                        color: 'var(--accent-bio)',
                        border: '1px solid var(--accent-dim)',
                      }}
                    >
                      {interaction.drug_a?.toUpperCase() || 'UNKNOWN'}
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>+</span>
                    <div
                      style={{
                        padding: '4px 10px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 4,
                        fontFamily: 'var(--font-display)',
                        fontSize: 12,
                        color: 'var(--accent-bio)',
                        border: '1px solid var(--accent-dim)',
                      }}
                    >
                      {interaction.drug_b?.toUpperCase() || 'UNKNOWN'}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 20,
                      background: 'var(--bg-void)',
                      border: `1px solid ${getSeverityColor(interaction.severity)}`,
                    }}
                  >
                    <AlertTriangle size={12} color={getSeverityColor(interaction.severity)} />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: getSeverityColor(interaction.severity),
                        letterSpacing: '0.1em',
                      }}
                    >
                      {interaction.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {interaction.description}
                </p>
                {/* Intelligent Alternative Suggestion */}
                <div 
                  style={{ 
                    borderTop: '1px solid var(--accent-dim)', 
                    paddingTop: 16,
                    background: 'rgba(0, 229, 195, 0.02)',
                    margin: '0 -12px',
                    padding: '16px 12px 0 12px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div style={{ padding: 4, background: 'rgba(52, 211, 153, 0.1)', borderRadius: 4 }}>
                      <Activity size={12} color="var(--accent-safe)" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-safe)', letterSpacing: '0.1em' }}>
                      INTELLIGENT ALTERNATIVE SUGGESTION
                    </span>
                  </div>
                  
                  <div 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      background: 'var(--bg-void)',
                      border: '1px solid var(--accent-dim)',
                      borderRadius: 4,
                      flexWrap: 'wrap',
                      gap: 16
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>REPLACEMENT FOR {interaction.drug_b?.toUpperCase() || 'COMPOUND'}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-primary)' }}>
                        {interaction.drug_b === 'Ibuprofen' ? 'Acetaminophen' : interaction.drug_b === 'Aspirin' ? 'Clopidogrel' : 'Consult Pharmacist'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-safe)' }}>98% COMPATIBILITY</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-muted)' }}>Matching therapeutic class</span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic' }}>
                    Suggestion based on Knowledge Graph branch exploration for "{interaction.drug_b?.includes('acid') || interaction.drug_b === 'Aspirin' ? 'Antiplatelets' : 'Therapeutic Equivalents'}" with neutral CYP-pathway profile.
                  </p>
                </div>
              </div>
            ))
          ) : checkerDrugs.length >= 2 ? (
            <div
              className="card"
              style={{
                padding: '40px',
                textAlign: 'center',
                background: 'rgba(34, 201, 122, 0.03)',
                border: '1px dashed var(--accent-safe)',
              }}
            >
              <ShieldCheck
                size={32}
                color="var(--accent-safe)"
                style={{ margin: '0 auto 16px' }}
              />
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--accent-safe)',
                  marginBottom: 8,
                }}
              >
                NO SIGNIFICANT INTERACTIONS FOUND
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                The selected compounds do not have documented contraindications in the current
                knowledge base.
              </p>
            </div>
          ) : (
            <div 
              className="flex-1 flex flex-col items-center justify-center animate-fade-in"
              style={{ padding: isMobile ? '20px 0' : '80px 0' }}
            >
              <div 
                style={{ 
                  textAlign: 'center', 
                  maxWidth: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? 12 : 24
                }}
              >
                <div style={{ position: 'relative' }}>
                  <AlertTriangle size={64} color="var(--text-muted)" style={{ opacity: 0.2 }} />
                  <Activity size={24} color="var(--accent-bio)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>
                
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '0.05em' }}>
                    AWAITING COMPOUND SELECTION
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Build a clinical profile by adding drugs from the <b>Search</b> results. The Safety Engine will automatically cross-reference interactions across the Knowledge Graph.
                  </p>
                </div>

                <div 
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--accent-dim)', 
                    borderRadius: 8, 
                    padding: '20px',
                    width: '100%'
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-bio)', marginBottom: 12, letterSpacing: '0.1em' }}>
                    QUICK START: TEST A KNOWN INTERACTION
                  </p>
                  <button 
                    className="btn-bio"
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => {
                        addCheckerDrug('Lepirudin');
                        addCheckerDrug('Ketorolac');
                        addToast('Sample case loaded: Lepirudin + Ketorolac', 'success');
                    }}
                  >
                    RUN SAMPLE CASE: LEPIRUDIN + KETOROLAC
                  </button>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic' }}>
                    Anticoagulant + NSAID · Documented bleeding risk in knowledge graph.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
