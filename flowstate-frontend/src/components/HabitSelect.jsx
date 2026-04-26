function HabitSelect({ title, done = false, onToggle, onDetails }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#6F7BFF',
      borderRadius: '50px',
      padding: '12px 16px 12px 24px',
      gap: '12px',
      width: '80%',
      margin: '0 auto'
    }}>
      <span style={{
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        flex: 1,
      }}>
        {title}
      </span>

      <button
        type="button"
        onClick={onDetails}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '8px 18px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        détails
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-label={done ? 'Marquer comme non fait' : 'Marquer comme fait'}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '3px solid #000',
          backgroundColor: done ? '#000' : '#fff',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export default HabitSelect;
