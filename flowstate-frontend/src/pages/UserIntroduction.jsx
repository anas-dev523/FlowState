import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogue, suivreHabitude } from '../services/api';
import Button from '../components/Button';
import {
  Check, Brain, Dumbbell, BookOpen, Droplets, Salad, Moon,
  PenLine, PhoneOff, Heart, Lightbulb, Thermometer, Footprints,
  Target, Leaf, Wind, CircleDot,
} from 'lucide-react';

const ICON_MAP = {
  'Méditation': Brain,
  'Sport': Dumbbell,
  'Lecture': BookOpen,
  'Hydratation': Droplets,
  'Bien manger': Salad,
  'Sommeil': Moon,
  'Journaling': PenLine,
  'Détox réseaux': PhoneOff,
  'Gratitude': Heart,
  'Apprendre': Lightbulb,
  'Douche froide': Thermometer,
  'Marche': Footprints,
  'Talent': Target,
  'Détox digital': Leaf,
  'Yoga': Wind,
};

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {habits.map((habit) => {
            const on = selected.includes(habit.id_habitude);
            const Icon = ICON_MAP[habit.titre] || CircleDot;
            return (
              <button
                key={habit.id_habitude}
                onClick={() => toggle(habit.id_habitude)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 8px',
                  borderRadius: '16px',
                  border: on ? '2px solid #6F7BFF' : '2px solid #f0f0f1',
                  backgroundColor: on ? '#6F7BFF' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: on ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: on ? '0 6px 20px rgba(111,123,255,0.3)' : 'none',
                  fontFamily: 'inherit',
                }}
              >
                {on && (
                  <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </div>
                )}
                <Icon size={24} color={on ? '#fff' : '#6F7BFF'} strokeWidth={2} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  color: on ? '#fff' : '#555',
                }}>
                  {habit.titre}
                </span>
              </button>
            );
          })}
        </div>

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
