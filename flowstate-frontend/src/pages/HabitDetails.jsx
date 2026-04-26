import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReturnArrow from "../components/ReturnArrow";
import InfoBlock from "../components/InfoBlock";
function HabitDetails(){
const navigate = useNavigate();
const location = useLocation();
const habit = location.state?.habit;

if (!habit) {
  return <p>Habitude non trouvée</p>;
}
    return (
        <div style={{ margin: '0 auto',maxWidth:'500px',padding: '60px 20px' } }>
        <div style={{ position: 'absolute', left: 20, top: 16 }}>
         <ReturnArrow onClick={()=>navigate("/HabitudesDuJour")} />
        </div>
        <h1 style={{ textAlign: 'center', margin: 0 }}>{habit.titre}</h1>
        <InfoBlock text={habit.description} />
        <p>Effets :</p>
        <InfoBlock text={habit.effets} />
        <p>Score FlowState : +{habit.points} points</p>

</div>
    );
}
export default HabitDetails;