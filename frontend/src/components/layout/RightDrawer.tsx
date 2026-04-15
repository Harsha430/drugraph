import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store';
import { api } from '../../services/api';
import { X, Activity, Beaker, ShieldAlert, Target, Info, Loader2 } from 'lucide-react';

export function RightDrawer() {
  const { activeDrug, rightDrawerOpen, closeRightDrawer, addToWatchlist, addCheckerDrug, setActiveView, addToast } = useAppStore();

  const { data: details, isLoading } = useQuery({
    queryKey: ['drug', activeDrug?.id],
    queryFn: () => api.getDrugDetails(activeDrug!.id),
    enabled: !!activeDrug?.id && rightDrawerOpen,
  });

  if (!rightDrawerOpen || !activeDrug) return null;

  const drug = details || activeDrug;

  const statusColor: Record<string, string> = {
    approved: 'var(--accent-safe)',
    investigational: 'var(--accent-warm)',
    withdrawn: 'var(--accent-danger)',
    experimental: 'var(--text-secondary)',
  };

  return (
    <div
      className="right-drawer"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 380,
        height: '100%',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--accent-dim)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--accent-dim)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                color: 'var(--accent-bio)',
                letterSpacing: '0.08em',
              }}
            >
              {drug.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                color: statusColor[drug.status] ?? 'var(--text-muted)',
                border: `1px solid ${statusColor[drug.status] ?? 'var(--text-muted)'}`,
                padding: '2px 6px',
                borderRadius: 3,
                letterSpacing: '0.1em',
              }}
            >
              {(drug.status || 'approved').toUpperCase()}
            </span>
            {isLoading && <Loader2 size={12} className="animate-spin text-accent-bio" />}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--text-secondary)',
            }}
          >
            {(drug.categories || []).length > 0 ? drug.categories.join(' · ') : 'SYSTEM COMPOUND'}
          </div>
        </div>
        <button
          onClick={closeRightDrawer}
          style={{
            background: 'none',
            border: '1px solid var(--accent-dim)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 16,
            padding: '4px 8px',
            borderRadius: 4,
            lineHeight: 1,
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <Section label="MECHANISM" icon={<Activity size={12} />}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {drug.mechanism || "Mechanism details are currently indexing for this compound."}
          </p>
        </Section>

        <Section label="DESCRIPTION" icon={<Info size={12} />}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {drug.description || "No supplemental description available."}
          </p>
        </Section>

        <Section label="PHARMACOKINETICS" icon={<Beaker size={12} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'HALF-LIFE', value: drug.halfLife },
              { label: 'BIOAVAILABILITY', value: drug.bioavailability },
              { label: 'PROTEIN BINDING', value: drug.proteinBinding },
              { label: 'MOL. WEIGHT', value: drug.molecularWeight },
            ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--accent-dim)',
                    borderRadius: 4,
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {value || 'N/A'}
                  </div>
                </div>
              )
            )}
          </div>
        </Section>

        {drug.targets && drug.targets.length > 0 && (
          <Section label="TARGETS" icon={<Target size={12} />}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {drug.targets.map((target: any) => (
                <span
                  key={typeof target === 'string' ? target : target.name}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--accent-warm)',
                    border: '1px solid rgba(232,168,56,0.3)',
                    padding: '3px 8px',
                    borderRadius: 3,
                    background: 'rgba(232,168,56,0.05)',
                  }}
                  title={typeof target === 'object' ? `ID: ${target.id} | Organism: ${target.organism}` : ''}
                >
                  {typeof target === 'string' ? target : target.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <StatPill 
            label="INTERACTIONS" 
            value={drug.interactionCount?.toString() || (drug.interactions?.length?.toString() || '0')} 
            color="var(--accent-danger)" 
            icon={<ShieldAlert size={12} />}
          />
          <StatPill 
            label="TARGETS" 
            value={drug.targetCount?.toString() || (drug.targets?.length?.toString() || '0')} 
            color="var(--accent-warm)" 
            icon={<Target size={12} />}
          />
        </div>
      </div>

      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--accent-dim)',
          display: 'flex',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <button
          className="btn-bio"
          style={{ flex: 1, fontSize: 10, border: '1px solid var(--accent-bio)', background: 'var(--accent-bio)', color: 'var(--bg-void)' }}
          onClick={() => {
            addToWatchlist(drug);
            addToast(`${drug.name} added to watchlist`, 'success');
          }}
        >
          + WATCHLIST
        </button>
        <button
          className="btn-bio"
          style={{ flex: 1, fontSize: 10, border: '1px solid var(--accent-warm)', color: 'var(--accent-warm)' }}
          onClick={() => {
            addCheckerDrug(drug.name);
            addToast(`${drug.name} added for analysis`, 'success');
          }}
        >
          + ANALYSIS
        </button>
        <button
          className="btn-bio"
          style={{ flex: 1, fontSize: 10 }}
          onClick={() => {
            setActiveView('graph');
            closeRightDrawer();
          }}
        >
          ◎ GRAPH
        </button>
      </div>
    </div>
  );
}

function Section({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '0.14em',
          marginBottom: 8,
          borderBottom: '1px solid var(--accent-dim)',
          paddingBottom: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function StatPill({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--bg-elevated)',
        border: `1px solid ${color}33`,
        borderRadius: 4,
        padding: '8px 12px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 6, right: 6, opacity: 0.5, color }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.12em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}
