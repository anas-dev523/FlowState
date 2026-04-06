import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, updatePassword, deleteAccount } from "../services/api";

const UserSpace = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    prenom: storedUser.prenom || "",
    nom: storedUser.nom || "",
    email: storedUser.email || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ ancienPassword: "", nouveauPassword: "", confirmer: "" });

  useEffect(() => {
    setPasswordForm({ ancienPassword: "", nouveauPassword: "", confirmer: "" });
  }, []);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const update = (key, val) => {
    setForm({ ...form, [key]: val });
    setSaved(false);
    setError("");
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile(form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.nouveauPassword !== passwordForm.confirmer) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await updatePassword({ ancienPassword: passwordForm.ancienPassword, nouveauPassword: passwordForm.nouveauPassword });
      setPasswordSaved(true);
      setPasswordForm({ ancienPassword: "", nouveauPassword: "", confirmer: "" });
      setPasswordError("");
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Erreur lors du changement de mot de passe");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")) return;
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression du compte");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = `${form.prenom?.[0] || ""}${form.nom?.[0] || ""}`.toUpperCase();
  const date = new Date(storedUser.date_creation)
  const dateExact = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return (
    <div style={{
      maxWidth: 390,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#FAFAF8",
      fontFamily: '"DM Sans", sans-serif',
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "16px 20px 0",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            width: 36, height: 36, borderRadius: 12,
            background: "#F0F0EC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1A18", letterSpacing: "-0.3px" }}>Mon profil</span>
      </div>

      {/* Avatar */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        marginTop: 32, marginBottom: 36,
      }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            background: "#6F7BFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, fontWeight: 600, color: "#fff",
            letterSpacing: "-0.5px",
            boxShadow: "0 8px 24px rgba(111,123,255,0.25)",
          }}>
            {initials}
          </div>
        </div>
        <p style={{
          marginTop: 14, fontSize: 20, fontWeight: 600, color: "#1A1A18",
          letterSpacing: "-0.4px",
        }}>{form.prenom} {form.nom}</p>
        <p style={{
          marginTop: 2, fontSize: 13, color: "#8A8A86", fontWeight: 400,
        }}>Membre depuis {dateExact}</p>
      </div>

      {/* Form */}
      <div style={{ padding: "0 20px" }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "6px 0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)",
        }}>
          <Field label="Prénom" value={form.prenom} onChange={v => update("prenom", v)} placeholder="Entrez votre prénom" />
          <Divider />
          <Field label="Nom" value={form.nom} onChange={v => update("nom", v)} placeholder="Entrez votre nom" />
          <Divider />
          <Field label="Email" value={form.email} onChange={v => update("email", v)} type="email" placeholder="Entrez votre email" />
        </div>

        {/* Error message */}
        {error && (
          <p style={{ color: "#E05252", fontSize: 13, marginTop: 10, textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            marginTop: 28,
            padding: "16px 0",
            borderRadius: 14,
            border: "none",
            background: saved
              ? "#22C55E"
              : "#6F7BFF",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif',
            cursor: "pointer",
            letterSpacing: "-0.2px",
            boxShadow: saved
              ? "0 4px 16px rgba(34,197,94,0.3)"
              : "0 4px 16px rgba(111,123,255,0.3)",
            transition: "all 0.3s ease",
            transform: saved ? "scale(0.98)" : "scale(1)",
          }}
        >
          {saved ? "✓  Enregistré" : "Enregistrer les modifications"}
        </button>

        {/* Password section */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "6px 0",
          marginTop: 28,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)",
        }}>
          <Field label="Mot de passe actuel" value={passwordForm.ancienPassword} onChange={v => { setPasswordForm({ ...passwordForm, ancienPassword: v }); setPasswordError(""); }} type="password" placeholder="Entrez votre mot de passe actuel" autoComplete="new-password" />
          <Divider />
          <Field label="Nouveau mot de passe" value={passwordForm.nouveauPassword} onChange={v => { setPasswordForm({ ...passwordForm, nouveauPassword: v }); setPasswordError(""); }} type="password" placeholder="Entrez votre nouveau mot de passe" autoComplete="new-password" />
          <Divider />
          <Field label="Confirmer" value={passwordForm.confirmer} onChange={v => { setPasswordForm({ ...passwordForm, confirmer: v }); setPasswordError(""); }} type="password" placeholder="Confirmez le nouveau mot de passe" autoComplete="new-password" />
        </div>

        {passwordError && (
          <p style={{ color: "#E05252", fontSize: 13, marginTop: 10, textAlign: "center" }}>{passwordError}</p>
        )}

        <button
          onClick={handlePasswordChange}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "16px 0",
            borderRadius: 14,
            border: "none",
            background: passwordSaved ? "#22C55E" : "#1A1A18",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif',
            cursor: "pointer",
            letterSpacing: "-0.2px",
            transition: "all 0.3s ease",
          }}
        >
          {passwordSaved ? "✓  Modifié" : "Changer le mot de passe"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "16px 0",
            borderRadius: 14,
            border: "1px solid #E05252",
            background: "transparent",
            color: "#E05252",
            fontSize: 15,
            fontWeight: 500,
            fontFamily: '"DM Sans", sans-serif',
            cursor: "pointer",
            letterSpacing: "-0.2px",
          }}
        >
          Se déconnecter
        </button>

        <button
          onClick={handleDeleteAccount}
          style={{
            width: "100%",
            marginTop: 12,
            marginBottom: 32,
            padding: "16px 0",
            borderRadius: 14,
            border: "none",
            background: "transparent",
            color: "#E05252",
            fontSize: 13,
            fontWeight: 400,
            fontFamily: '"DM Sans", sans-serif',
            cursor: "pointer",
            letterSpacing: "-0.2px",
          }}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", readOnly, placeholder, autoComplete }) => (
  <div style={{
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: readOnly ? "pointer" : "default",
  }}>
    <div style={{ flex: 1 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 500,
        color: "#8A8A86",
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        marginBottom: 4,
      }}>{label}</p>
      {readOnly ? (
        <p style={{ fontSize: 15, color: "#1A1A18", fontWeight: 400 }}>{value}</p>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: 15,
            color: "#1A1A18",
            fontWeight: 400,
            fontFamily: '"DM Sans", sans-serif',
            width: "100%",
            background: "transparent",
            padding: 0,
          }}
        />
      )}
    </div>
  </div>
);

const Divider = () => (
  <div style={{
    height: 1,
    background: "#F0F0EC",
    marginLeft: 20,
    marginRight: 20,
  }} />
);

export default UserSpace;
