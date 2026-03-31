function TrashIcon({ size = 20, onClick }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000"
      onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d="M9 3v1H4v2h1l1 14h12l1-14h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"/>
    </svg>
  );
}
export default TrashIcon;
