import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout logoWidth={200} showBackArrow onBack={() => navigate('/register')}>
      {error && (
        <p style={{
          color: '#dc2626', backgroundColor: '#fef2f2',
          padding: '8px 16px', borderRadius: '10px',
          textAlign: 'center', fontSize: '13px',
          width: '100%', maxWidth: '300px', marginBottom: '10px'
        }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '14px',
        width: '100%', maxWidth: '300px'
      }}>
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
        <Button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/register')}>
          Creer un compte
        </Button>
        <div style={{ textAlign: 'center', marginTop: '12px'}}>
        <span
            onClick={() => navigate('/ForgotPassword')}
            style={{ color: '#6F7BFF', textDecoration: 'underline', cursor: 'pointer' }}
          >
            mot de passe oublié 
          </span>
          </div>
      </form>

    </AuthLayout>
  );
}

export default Login;
