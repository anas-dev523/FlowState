import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [nouveauPassword, setNouveauPassword] = useState('');
  const [confirmer, setConfirmer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (nouveauPassword !== confirmer) {
          setError("Les mots de passe pas bien");
          return;
        }
        try {
          await resetPassword({token, nouveauPassword: nouveauPassword });
          setSuccess(true);
          navigate('/login');
        } catch (err) {
          setError(err.response?.data?.error || "Erreur lors du changement de mot de passe");
        }
      };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <form onSubmit={handleSubmit}>
          <Input type="password" name ="nouveauPassword" placeholder ="Nouveau password" onChange={e => setNouveauPassword(e.target.value)}></Input>
          <div style={{marginTop: '16px'}}>
          <Input type="password" name ="confirmer" placeholder ="confirme le Nouveau password" onChange={e => setConfirmer(e.target.value)}></Input>
          </div>
          <div style={{marginTop: '16px'}}>
          <Button variant="filled" width="100%" type="submit" style={{marginTop: '16px'}}>
 validation de mot de passe </Button></div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Mot de passe modifié ! Redirection...</p>}
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
