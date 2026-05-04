import HabitSelect from '../components/HabitSelect';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabitudes, validerHabitude, devaliderHabitude, getValidationsToday, unfollowHabitude } from '../services/api';
import ReturnArrow from '../components/ReturnArrow';
import ConfirmModal from '../components/ConfirmModal';
function HabitudesDuJour(){
    const navigate =useNavigate();
    const[habits,setHabits]=useState([]);
    const [done,setDone]=useState([]);
    const [error, setError] = useState('');
    const [fetching, setFetching] = useState(true);
    const [confirmingId, setConfirmingId] = useState(null);
    useEffect(() => {
    Promise.all([getHabitudes(), getValidationsToday()])
        .then(([habitsRes, validationsRes]) => {
            setHabits(habitsRes.data);
            setDone(validationsRes.data);
        })
        .catch(() => setError('Impossible de charger les habitudes'))
        .finally(() => setFetching(false));
}, []);

    const handleValider = async (id) => {
        setError('');
        try {
             if (done.includes(id)){
                await devaliderHabitude(id);
                setDone((prev) => prev.filter((x) => x !== id));
               }
            else{
                await validerHabitude(id);
                setDone((prev) => [...prev, id]);}
    } catch (err) {
        setError(err.response?.data?.error || 'Erreur');
    }};
const handleDelete = (id) => {
  setConfirmingId(id);
};
const confirmDelete = async () => {
  try {
    await unfollowHabitude(confirmingId);
    setHabits(prev => prev.filter(h => h.id_habitude !== confirmingId));
  } catch (err) {
    setError(err.response?.data?.error || 'Erreur');
  }
  setConfirmingId(null);  
}
    if(fetching){return (
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
    return(

       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        {confirmingId !== null && (
  <ConfirmModal
    message="Supprimer cette habitude de ta liste ?"
    onConfirm={confirmDelete}
    onCancel={() => setConfirmingId(null)}
  />
)}
        
        <div style={{ position: 'relative', padding: '16px 20px 0' }}>
        <div style={{ position: 'absolute', left: 20, top: 16 }}>
         <ReturnArrow onClick={()=>navigate("/dashboard")} />
        </div>
        <h1 style={{ textAlign: 'center', margin: 0 }}>Résumé du jour</h1>
        </div>
        {habits.map((habit) =>(
            <section key={habit.id_habitude}>
            <HabitSelect
            title ={habit.titre}
            onDelete={() => handleDelete(habit.id_habitude)}
            done={done.includes(habit.id_habitude)}
            onToggle={()=>handleValider(habit.id_habitude)}
            onDetails={()=>{navigate ("/HabitDetails",{state: {habit }}) }}
            />
            </section>
        )
        )}
     </div>);
}
export default HabitudesDuJour;