import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

function TermsModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff', borderRadius: '16px',
          padding: '28px', maxWidth: '480px', width: '100%',
          maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#1a1a2e', fontSize: '18px' }}>Conditions d'utilisation</h2>

        <h3 style={{ fontSize: '14px', color: '#333' }}>1. Acceptation des conditions</h3>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
          En créant un compte FlowState, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
        </p>

        <h3 style={{ fontSize: '14px', color: '#333' }}>2. Utilisation du service</h3>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
          FlowState est une application de suivi d'habitudes et de productivité. Vous vous engagez à utiliser le service de manière légale et à ne pas porter atteinte aux droits d'autrui.
        </p>

        <h3 style={{ fontSize: '14px', color: '#333' }}>3. Données personnelles</h3>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
          Vos données (nom, prénom, email) sont collectées uniquement pour le fonctionnement de l'application et ne sont pas partagées avec des tiers.
        </p>

        <h3 style={{ fontSize: '14px', color: '#333' }}>4. Responsabilité</h3>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
          FlowState ne peut être tenu responsable des interruptions de service ou des pertes de données liées à des causes extérieures.
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: '16px', width: '100%', padding: '12px',
            backgroundColor: '#6F7BFF', color: '#fff', border: 'none',
            borderRadius: '25px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }
    setLoading(true);
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        prenom: formData.prenom,
        nom: formData.nom
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout logoWidth={160}>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {error && (
        <p style={{
          color: '#dc2626', backgroundColor: '#fef2f2',
          padding: '8px 16px', borderRadius: '10px',
          textAlign: 'center', fontSize: '13px',
          width: '100%', maxWidth: '300px', marginBottom: '10px'
        }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        width: '100%', maxWidth: '300px'
      }}>
        <Input type="text" name="prenom" placeholder="Prénom *" value={formData.prenom} onChange={handleChange} required />
        <Input type="text" name="nom" placeholder="Nom *" value={formData.nom} onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Mot de passe *" value={formData.password} onChange={handleChange} required />
        <Input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe *" value={formData.confirmPassword} onChange={handleChange} required />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6F7BFF' }}
          />
          J'accepte les{' '}
          <span
            onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
            style={{ color: '#6F7BFF', textDecoration: 'underline', cursor: 'pointer' }}
          >
            conditions d'utilisation
          </span>
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
        <Link to="/login" style={{ color: '#6F7BFF', textDecoration: 'none', fontWeight: '500' }}>
          Deja un compte ? Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
