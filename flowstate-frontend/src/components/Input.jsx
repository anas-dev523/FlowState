// components/Input.jsx
// Champ de saisie réutilisable avec le style pill de FlowState

function Input({ type = 'text', placeholder, name, value, onChange, required }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        padding: '13px 20px',
        borderRadius: '25px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#f0f0f1',
        color: '#333',
        fontSize: '14px',
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'inherit',
        width: '100%',
        boxSizing: 'border-box'
      }}
    />
  );
}

export default Input;
