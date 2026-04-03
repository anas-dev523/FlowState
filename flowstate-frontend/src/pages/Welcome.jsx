import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#6F7BFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 30px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#000', marginBottom: '24px' }}>
        Bienvenue sur FlowState
      </h1>
      <p style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '48px', lineHeight: '1.5' }}>
        Ici, chaque habitude, chaque session de focus et chaque action positive t'aide à construire un esprit plus fort, plus clair et plus équilibré.
      </p>
      <Button variant="dark" onClick={() => navigate('/login')} width="260px">
        Continue
      </Button>
    </div>
  );
}

export default Welcome;
