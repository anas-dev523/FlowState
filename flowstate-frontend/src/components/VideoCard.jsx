function VideoCard({ titre, url, duree, onClick }) {
  const thumbnail = `https://img.youtube.com/vi/${url}/maxresdefault.jpg`;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={thumbnail}
          alt={titre}
          style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '22px',
          }}
        >
          ▶
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
      }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{titre}</span>
        <span style={{ fontSize: '13px', color: '#999' }}>{duree} min</span>
      </div>
    </div>
  );
}

export default VideoCard;
