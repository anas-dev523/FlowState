function StatCard({ value, label }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#6F7BFF',
      borderRadius: '12px',
      padding: '16px 12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      textAlign: 'center',
      minWidth: 0,
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        fontWeight: '700',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </div>
    </div>
  );
}

export default StatCard;
