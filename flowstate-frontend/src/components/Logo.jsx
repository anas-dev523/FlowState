// components/Logo.jsx
// Composant Logo reutilisable dans toute l'app

function Logo({ width = 120 }) {
  return (
    <img
      src="/FlowStateLogo.png"
      alt="FlowState"
      width={width}
    />
  );
}

export default Logo;
