
import {
  Check, Brain, Dumbbell, BookOpen, Droplets, Salad, Moon,
  PenLine, PhoneOff, Heart, Lightbulb, Thermometer, Footprints,
  Target, Leaf, Wind, CircleDot,
} from 'lucide-react';


function HabitGrid({habits,selected,onToggle,excludedIds=[]}){
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

return(
<div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {habits.map((habit) => {
            const on = selected.includes(habit.id_habitude);
            const Icon = ICON_MAP[habit.titre] || CircleDot;
            const isExcluded = excludedIds.includes(habit.id_habitude);
            return (
              <button
                key={habit.id_habitude}
                onClick={() => { if (!isExcluded) onToggle(habit.id_habitude); }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 8px',
                  borderRadius: '16px',
                  border: on ? '2px solid #6F7BFF' : '2px solid #f0f0f1',
                  backgroundColor: isExcluded ? '#f0f0f1' : (on ? '#6F7BFF' : '#fff'),
                  cursor: isExcluded ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  transform: on ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: on ? '0 6px 20px rgba(111,123,255,0.3)' : 'none',
                  fontFamily: 'inherit',
                  opacity: isExcluded ? 0.6 : 1,
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
                {isExcluded && (
  <span style={{ fontSize: '10px', color: '#999' }}>Déjà ajouté</span>
)}
              </button>
            );
          })}
        </div>

        );
 }
export default HabitGrid;