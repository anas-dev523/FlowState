import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useEffect,useState} from 'react';
import { getHabitudes,getValidationsToday } from '../services/api';
import { useGlobalStats } from '../hooks/useGlobalStats';
import { useDailyCompletion } from '../hooks/useDailyCompletion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [habits,setHabits]= useState([]);
  const [done,setDone]=useState([]);
  const stats = useGlobalStats();
  const dailyCompletion = useDailyCompletion(14);
    useEffect(() => {
    Promise.all([getHabitudes(), getValidationsToday()])
        .then(([habitsRes, validationsRes]) => {
            setHabits(habitsRes.data);
            setDone(validationsRes.data);
        })
        }, [])
  const percent = habits.length > 0 ? (done.length / habits.length) * 100 : 0;
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#6F7BFF', padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Logo width={100} />
        <div
          onClick={() => navigate('/UserSpace')}
          style={{
            width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
            backgroundColor: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 15,
            color: '#6F7BFF', flexShrink: 0,
          }}
        >
          {`${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase()}
        </div>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Statistiques */}
        <section>
          <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Statistiques :</h2>
          <div onClick={() => navigate("/Statistiques")} style={{
            backgroundColor: '#6F7BFF', borderRadius: '12px',
            padding: '16px 20px', color: '#fff' ,cursor: 'pointer',
          }}>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>score : {stats?.score ?? '...'}</p>
            <div style={{ height: '60px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyCompletion} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Area type="monotone" dataKey="percent" stroke="#fff" fill="hsla(0, 0%, 100%, 0.40)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Résumé de jour */}
        <section>
          <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Résumé de jour :</h2>
          <div
            onClick={() => navigate('/HabitudesDuJour')}
            style={{
              backgroundColor: '#6F7BFF', borderRadius: '12px',
              padding: '16px 20px', color: '#fff', cursor: 'pointer'
            }}>
            <p style={{ fontSize: '13px', marginBottom: '8px' }}>Habitudes terminé :</p>
            <div style ={{width: '100%',height: '10px',borderRadius: '5px',
            backgroundColor: '#ffffff4d' }}>
            <div style={{
              height: '10px', backgroundColor: '#000',
              borderRadius: '5px', width: `${percent}%` 
            }} />
          </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section>
          <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>actions rapides :</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Commencer un focus', path: '/focus' },
              { label: 'Ajouter une habitude', path: '/SelectHabit' },
              { label: 'Vidéo de motivation', path: '/motivation' },
            ].map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                style={{
                  backgroundColor: '#6F7BFF', borderRadius: '12px',
                  padding: '20px 12px', color: '#fff', textAlign: 'center',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;
