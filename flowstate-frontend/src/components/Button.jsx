// Bouton réutilisable : variant "filled" (bleu plein) ou "outline" (bordure bleue)

function Button({ children, onClick, type = 'button', variant = 'filled', disabled = false, width = '100%' }) {
  const base = {
    padding: '13px',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    width: width,
    fontFamily: 'inherit'
  };

  const styles = {
    filled: {
      ...base,
      border: 'none',
      backgroundColor: '#1B2AD1',
      color: '#ffffff'
    },
    outline: {
      ...base,
      border: '2px solid #1B2AD1',
      backgroundColor: 'transparent',
      color: '#1B2AD1'
    },
    dark: {
      ...base,
      border:'none',
      backgroundColor: '#000',
      color :'#ffffff'
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
