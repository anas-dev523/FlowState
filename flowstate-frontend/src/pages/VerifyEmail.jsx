import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const token = searchParams.get('token');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('waiting');
      return;
    }
    if (hasVerified.current) return;
    hasVerified.current = true;
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '24px',
      backgroundColor: '#fff',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {status === 'waiting' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
              Vérifie ta boîte mail
            </h2>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>
              Un lien de confirmation a été envoyé à ton adresse email.<br />
              Clique dessus pour activer ton compte.
            </p>
          </>
        )}
        {status === 'loading' && (
          <p style={{ color: '#555' }}>Vérification en cours...</p>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
              Email confirmé !
            </h2>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
              Ton compte est activé. Tu peux maintenant te connecter.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 32px', borderRadius: '25px', border: 'none',
                backgroundColor: '#6F7BFF', color: '#fff', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Se connecter
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
              Lien invalide
            </h2>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
              Ce lien est invalide ou a déjà été utilisé.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '12px 32px', borderRadius: '25px', border: 'none',
                backgroundColor: '#6F7BFF', color: '#fff', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Retour à l'inscription
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
