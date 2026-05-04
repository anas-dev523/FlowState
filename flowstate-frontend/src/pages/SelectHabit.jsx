import HabitGrid from "../components/HabitGrid";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogue, getHabitudes } from '../services/api';

function SelectHabit(){
  const [habits, setHabits] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [followed , setFollowed] = useState([]);
  const navigate = useNavigate();
  const excludedIds = followed.map(h => h.id_habitude);
useEffect(() => {
  Promise.all([getCatalogue(), getHabitudes()])
    .then(([catalogRes, followedRes]) => {
      setHabits(catalogRes.data);
      setFollowed(followedRes.data);
    })
    .catch(() => setError('Impossible de charger les habitudes'))
    .finally(() => setFetching(false));
}, []);

const toggle = (id) =>{
  const habit = habits.find(h => h.id_habitude === id);
  navigate('/ConfirmHabit', { state: { habit } });
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
          Ajouter une habitude
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          margin: '0 0 28px 0',
        }}>
          Sélectionnez celles que vous souhaitez ajouter 
          (vous pouvez en ajouter une seule à la fois)
        </p>
       <HabitGrid habits={habits} selected={[]} onToggle={toggle} excludedIds={excludedIds}/>

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
    </div>
    </div>
);
}
export default SelectHabit