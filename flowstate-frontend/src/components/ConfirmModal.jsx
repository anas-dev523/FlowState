function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff', borderRadius: '16px',
          padding: '28px', maxWidth: '380px', width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '15px', color: '#333', marginTop: 0, marginBottom: '20px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px',
              backgroundColor: '#f0f0f1', color: '#333', border: 'none',
              borderRadius: '25px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px',
              backgroundColor: '#dc2626', color: '#fff', border: 'none',
              borderRadius: '25px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
