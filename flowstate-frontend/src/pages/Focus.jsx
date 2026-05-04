import Button from '../components/Button';
import {useEffect, useState} from 'react';
import { startSession, endSession } from '../services/api';
function Focus() {
const [startTime,setStartTime]=useState(25);
const [timeLeft,setTimeLeft]=useState(startTime*60);
const [isRunning,setIsRunning]=useState(false);
const [sessionId, setSessionId] = useState(null);
const minutes = Math.floor(timeLeft/60);
const seconds = timeLeft%60 ;
useEffect(()=>{
      if (!isRunning) return;
      const id=setInterval(() => setTimeLeft(prev =>prev - 1),1000)
    return () => clearInterval(id);
},[isRunning]);
const endActiveSession = () => {
  if (sessionId !== null) {
    endSession(sessionId, {}).catch((err) => console.error(err));
    setSessionId(null);
  }
};
useEffect(() => {
  if (timeLeft === 0 && isRunning) {
    setIsRunning(false);
    endActiveSession();
  }
}, [timeLeft, isRunning]);


const handleToggleRun = async () => {
  if (!isRunning && sessionId === null) {
    try {
      const res = await startSession({});
      setSessionId(res.data.id_session_focus);
    } catch (err) {
      console.error(err);
      return;
    }
  }
  setIsRunning(!isRunning);
};

const handleReset = () => {
  endActiveSession();
  setIsRunning(false);
  setTimeLeft(startTime * 60);
};

const handleSelectDuration = (duration) => {
  endActiveSession();
  setStartTime(duration);
  setTimeLeft(duration * 60);
  setIsRunning(false);
};
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#000' }}>
          Mode Focus
        </h1>
        <p style={{ color: '#999', fontSize: '14px', marginTop: '6px' }}>
          Concentre-toi, accomplis tes objectifs
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '40px',
      }}>
        {[15, 25, 45, 60].map((duration) => {
          const isSelected = duration === startTime;
          return (
            <button onClick={() => handleSelectDuration(duration)}
              key={duration}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: isSelected ? '#6F7BFF' : '#f0f0f1',
                color: isSelected ? '#fff' : '#555',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {duration} min
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '40px',
      }}>
        <div style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '3px solid #6F7BFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          fontWeight: '700',
          color: '#000',
        }}>
          {minutes}:{seconds <10 ? '0'+seconds :seconds}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{ width: '140px' }}>
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
        </div>
        <div style={{ width: '140px' }}>
          <Button variant="filled" onClick={handleToggleRun}>
            {isRunning ? 'Pause' : 'Démarrer'}
          </Button>
        </div>
      </div>

    </div>
  );
}

export default Focus;
