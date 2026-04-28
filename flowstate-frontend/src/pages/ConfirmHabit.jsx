import HabitDetails from './HabitDetails';
import { useNavigate } from 'react-router-dom';
import { suivreHabitude } from '../services/api';

function ConfirmHabit() {
  const navigate = useNavigate();
  const handleAdd = async (id) => {
    try {
      await suivreHabitude(id);
      navigate('/HabitAdded');
    } catch (err) {
    console.error(err);
    }
  };

  return <HabitDetails onAdd={handleAdd} />;
}

export default ConfirmHabit;
