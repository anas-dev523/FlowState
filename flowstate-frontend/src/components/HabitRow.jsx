import SettingsIcon from './SettingsIcon';
import TrashIcon from './TrashIcon';

function HabitRow({ name, onSettings, onDelete }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f5f5f5',
      padding: '14px 16px',
      marginBottom: '8px'
    }}>
      <span style={{ fontSize: '15px', fontWeight: '500', color: '#000' }}>
        {name}
      </span>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SettingsIcon size={22} onClick={onSettings} />
        <TrashIcon size={22} onClick={onDelete} />
      </div>
    </div>
  );
}

export default HabitRow;
