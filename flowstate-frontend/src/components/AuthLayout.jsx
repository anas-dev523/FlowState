// Layout partagé entre Login et Register :
// bloc bleu en haut avec logo + coupe diagonale + blanc en bas

import Logo from './Logo';

function AuthLayout({ children, logoWidth = 160, showBackArrow = false, onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      backgroundColor: '#ffffff'
    }}>
      {/* Bloc bleu */}
      <div style={{
        backgroundColor: '#6F7BFF',
        padding: '50px 20px 80px',
        position: 'relative',
        textAlign: 'center'
      }}>
        {showBackArrow && (
          <button onClick={onBack} style={{
            position: 'absolute', top: '20px', left: '16px',
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <Logo width={logoWidth} />

        {/* Coupe diagonale */}
        <svg
          style={{ position: 'absolute', bottom: '-1px', left: 0, width: '100%', height: '50px' }}
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 100,50 0,50" fill="#ffffff" />
        </svg>
      </div>

      {/* Bloc blanc avec le contenu (formulaire) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 40px 40px'
      }}>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
