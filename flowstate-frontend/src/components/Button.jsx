// Bouton réutilisable : variant "filled" (bleu plein) ou "outline" (bordure bleue)

function Button({ children, onClick, type = 'button', variant = 'filled', disabled = false }) {
  const base = {
    padding: '13px',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'inherit'
  };

  const styles = {
    filled: {
      ...base,
      border: 'none',
      backgroundColor: '#6F7BFF',
      color: '#ffffff'
    },
    outline: {
      ...base,
      border: '2px solid #6F7BFF',
      backgroundColor: 'transparent',
      color: '#6F7BFF'
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

export default Button;
