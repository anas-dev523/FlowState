import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
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
        <Input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
        <Input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
        <Input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} required />
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
