function PlusIcon({ size = 24, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: size, height: size,
      borderRadius: '50%',
      backgroundColor: '#000000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer'
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none"
        stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  );
}
export default PlusIcon;
