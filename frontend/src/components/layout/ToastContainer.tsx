import { useAppStore } from '../../store';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--accent-bio)',
            borderRadius: 4,
            padding: '8px 14px',
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            color: 'var(--accent-bio)',
            letterSpacing: '0.06em',
            boxShadow: '0 0 16px rgba(0,229,195,0.15)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            maxWidth: 320,
          }}
          onClick={() => removeToast(toast.id)}
        >
          [ {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : toast.type === 'warning' ? '⚠' : '◈'} {toast.message} ]
        </div>
      ))}
    </div>
  );
}
