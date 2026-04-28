import { useNavigate} from "react-router-dom";
import Button from "../components/Button";
function HabitAdded(){
  const navigate = useNavigate();
  return (
<div style={{
  backgroundColor: '#6F7BFF',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px', 
}}>
      <h2 style={{ color:'#fff'}}>Ton habitude a été ajoutée avec succès</h2>
      <div style={{ width: '60%', maxWidth: '300px' }}>
      <Button variant="dark" onClick={() => navigate('/dashboard')}>
        Continue
      </Button>
      </div>
    </div>
  );
}

export default HabitAdded;