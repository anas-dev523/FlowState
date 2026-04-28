import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogue, suivreHabitude } from '../services/api';
import Button from '../components/Button';
import HabitGrid from '../components/HabitGrid';

export default function UserIntroduction() {
  const [habits, setHabits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCatalogue()
      .then((res) => setHabits(res.data))
      .catch(() => setError('Impossible de charger les habitudes'))
      .finally(() => setFetching(false));
  }, []);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleStart = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError('');
    try {
      await Promise.all(selected.map((id) => suivreHabitude(id)));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#6F7BFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#fff', fontSize: '16px' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#6F7BFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '25px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '580px',
        padding: '40px 32px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#6F7BFF',
          textAlign: 'center',
          margin: '0 0 4px 0', 
        }}>
          Vos habitudes
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          margin: '0 0 28px 0',
        }}>
          Selectionnez celles que vous souhaitez construire
        </p>

        {error && (
          <p style={{
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            padding: '8px 16px',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '13px',
            marginBottom: '16px',
          }}>{error}</p>
        )}
        <HabitGrid habits={habits} selected={selected} onToggle={toggle}/>
        <Button
          onClick={handleStart}
          disabled={selected.length === 0 || loading}
        >
          {loading
            ? 'Preparation...'
            : `Commencer (${selected.length})`}
        </Button>
      </div>
    </div>
  );
}
