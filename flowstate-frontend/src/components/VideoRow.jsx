import SettingsIcon from './SettingsIcon';
import TrashIcon from './TrashIcon';

function VideoRow({ title, thumbnail, onSettings, onDelete }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f5f5f5',
      padding: '10px 16px',
      marginBottom: '8px'
    }}>
      <img src={thumbnail} alt={title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
      <span style={{ flex: 1, marginLeft: '12px', fontSize: '14px', fontWeight: '500', color: '#000' }}>
        {title}
      </span>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SettingsIcon size={22} onClick={onSettings} />
        <TrashIcon size={22} onClick={onDelete} />
      </div>
    </div>
  );
}

export default VideoRow;
