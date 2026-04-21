import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import {
  ListChecks , Timer,Play ,BarChart
} from 'lucide-react';

function AppIntroduction(){
  const navigate = useNavigate();
  const features = [
  { icon: ListChecks, title: 'Suivez vos habitudes', description: 'Cochez vos habitudes chaque jour pour maintenir votre elan et construire des routines solides.' },
  { icon: Timer, title: 'Sessions de focus', description: 'Utilisez le minuteur Pomodoro pour travailler en profondeur sans distraction.' },
  { icon: Play, title: 'Vidéos motivantes', description: 'Accedez à des videos inspirantes selectionnees pour booster votre motivation quotidienne' },
  { icon: BarChart, title: 'Suivez vos progrès', description: 'Visualisez votre evolution avec des statistiques claires et des grappiques de progression' },
];


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
          Bienvenu sur FlowState
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          margin: '0 0 28px 0',
        }}>
          Voici comment ça fonctionne :
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {features.map((feature,index) => {
            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 8px',
                  borderRadius: '16px',
                  border:  '2px solid #f0f0f1',
                  backgroundColor: '#ebedf1',
                  fontFamily: 'inherit',
                }}
              >
                <div style ={{
                    backgroundColor: '#6F7BFF',
                    padding: '10px',
                    borderRadius: '10px' ,
                    display: 'flex',
                    alignItems: 'center' ,
                    justifyContent: 'center'
                }}>
                <feature.icon size={24} color={'#fff'} strokeWidth={2} />
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  color: '#2300a3',
                }}>
                  {feature.title}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  color: '#6F7BFF',
                }}>
                    {feature.description}
                </span>
              </div>
            );
          })}
        </div>

        <Button onClick={()=>navigate('/userIntroduction')}>
          { `Choisir mes habitudes `}
        </Button>
      </div>
    </div>
  );
}
export default AppIntroduction;