import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminGetStats, getCatalogue, getVideos,
  adminCreateHabit, adminUpdateHabit, adminDeleteHabit,
  adminCreateVideo, adminUpdateVideo, adminDeleteVideo,logout
} from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import usePageTitle from '../hooks/usePageTitle';

function Admin() {
  usePageTitle('Administration');
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [habitudes, setHabitudes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editHabitData, setEditHabitData] = useState({});
  const [editVideoData, setEditVideoData] = useState({});
  const [newHabit, setNewHabit] = useState({ titre: '', description: '', effets: '', points: 0 });
  const [newVideo, setNewVideo] = useState({ titre: '', url: '', categorie: '', duree: 0 });
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [s, h, v] = await Promise.all([adminGetStats(), getCatalogue(), getVideos()]);
      setStats(s.data);
      setHabitudes(h.data);
      setVideos(v.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddHabit = async () => {
    if (!newHabit.titre.trim()) return setError('Le titre est obligatoire');
    try {
      await adminCreateHabit({ ...newHabit, points: parseInt(newHabit.points) || 0 });
      setNewHabit({ titre: '', description: '', effets: '', points: 0 });
      setShowAddHabit(false);
      setError('');
      loadData();
    } catch {
      setError('Erreur lors de l\'ajout de l\'habitude');
    }
  };

  const startEditHabit = (h) => {
    setEditingHabit(h.id_habitude);
    setEditHabitData({ titre: h.titre, description: h.description || '', effets: h.effets || '', points: h.points });
  };

  const handleSaveHabit = async (id) => {
    try {
      await adminUpdateHabit(id, { ...editHabitData, points: parseInt(editHabitData.points) || 0 });
      setEditingHabit(null);
      loadData();
    } catch {
      setError('Erreur lors de la modification');
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo.titre.trim() || !newVideo.url.trim()) return setError('Titre et URL sont obligatoires');
    try {
      await adminCreateVideo({ ...newVideo, duree: parseInt(newVideo.duree) || null });
      setNewVideo({ titre: '', url: '', categorie: '', duree: 0 });
      setShowAddVideo(false);
      setError('');
      loadData();
    } catch {
      setError('Erreur lors de l\'ajout de la vidéo');
    }
  };

  const startEditVideo = (v) => {
    setEditingVideo(v.id_video);
    setEditVideoData({ titre: v.titre, url: v.url, categorie: v.categorie || '', duree: v.duree || 0 });
  };

  const handleSaveVideo = async (id) => {
    try {
      await adminUpdateVideo(id, { ...editVideoData, duree: parseInt(editVideoData.duree) || null });
      setEditingVideo(null);
      loadData();
    } catch {
      setError('Erreur lors de la modification');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'habit') await adminDeleteHabit(confirmDelete.id);
      else await adminDeleteVideo(confirmDelete.id);
      setConfirmDelete(null);
      loadData();
    } catch {
      setError('Erreur lors de la suppression');
      setConfirmDelete(null);
    }
  };

  if (!stats) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <p style={{ color: '#555' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: '100vh',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#000' }}>
          Admin Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/Dashboard')}
            style={secondaryBtnStyle}
          >
            Espace utilisateur
          </button>
          <button
            onClick={() => {
              logout();
              localStorage.removeItem('user');
              navigate('/login');
            }}
            style={secondaryBtnStyle}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {error && (
        <p style={{
          color: '#dc2626', backgroundColor: '#fef2f2',
          padding: '10px 16px', borderRadius: '10px',
          textAlign: 'center', fontSize: '13px', marginBottom: '16px'
        }}>{error}</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '32px',
      }}>
        <StatBox label="Utilisateurs" value={stats.users} />
        <StatBox label="Habitudes" value={stats.habitudes} />
        <StatBox label="Vidéos" value={stats.videos} />
        <StatBox label="Sessions" value={stats.sessions} />
      </div>

      <Section
        title="Gestion des habitudes"
        count={habitudes.length}
        action={
          <button style={primaryBtnStyle} onClick={() => setShowAddHabit(!showAddHabit)}>
            {showAddHabit ? '× Annuler' : '+ Ajouter'}
          </button>
        }
      >
        {showAddHabit && (
          <div style={addCardStyle}>
            <input style={inputStyle} placeholder="Titre *" value={newHabit.titre}
              onChange={e => setNewHabit({ ...newHabit, titre: e.target.value })} />
            <input style={inputStyle} placeholder="Description" value={newHabit.description}
              onChange={e => setNewHabit({ ...newHabit, description: e.target.value })} />
            <input style={inputStyle} placeholder="Effets" value={newHabit.effets}
              onChange={e => setNewHabit({ ...newHabit, effets: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Points" value={newHabit.points}
              onChange={e => setNewHabit({ ...newHabit, points: e.target.value })} />
            <button style={primaryBtnStyle} onClick={handleAddHabit}>Créer</button>
          </div>
        )}

        <div style={gridStyle}>
          {habitudes.map(h => (
            <div key={h.id_habitude} style={cardStyle}>
              {editingHabit === h.id_habitude ? (
                <>
                  <input style={inputStyle} value={editHabitData.titre}
                    onChange={e => setEditHabitData({ ...editHabitData, titre: e.target.value })} />
                  <input style={inputStyle} value={editHabitData.description}
                    onChange={e => setEditHabitData({ ...editHabitData, description: e.target.value })} />
                  <input style={inputStyle} value={editHabitData.effets}
                    onChange={e => setEditHabitData({ ...editHabitData, effets: e.target.value })} />
                  <input style={inputStyle} type="number" value={editHabitData.points}
                    onChange={e => setEditHabitData({ ...editHabitData, points: e.target.value })} />
                  <div style={cardActionsStyle}>
                    <button style={primaryBtnStyle} onClick={() => handleSaveHabit(h.id_habitude)}>Enregistrer</button>
                    <button style={secondaryBtnStyle} onClick={() => setEditingHabit(null)}>Annuler</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#000', margin: 0, lineHeight: 1.3 }}>{h.titre}</h3>
                    <span style={pointsBadgeStyle}>+{h.points}</span>
                  </div>
                  {h.description && (
                    <p style={{ fontSize: '13px', color: '#555', margin: '0 0 8px 0', lineHeight: 1.4 }}>{h.description}</p>
                  )}
                  {h.effets && (
                    <p style={{ fontSize: '12px', color: '#6F7BFF', margin: '0 0 12px 0', fontStyle: 'italic' }}>{h.effets}</p>
                  )}
                  <div style={cardActionsStyle}>
                    <button style={editBtnStyle} onClick={() => startEditHabit(h)}>Modifier</button>
                    <button style={dangerBtnStyle} onClick={() => setConfirmDelete({ type: 'habit', id: h.id_habitude, name: h.titre })}>Supprimer</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {habitudes.length === 0 && (
            <p style={emptyStyle}>Aucune habitude. Clique sur "+ Ajouter" pour en créer une.</p>
          )}
        </div>
      </Section>

      <Section
        title="Gestion des vidéos"
        count={videos.length}
        action={
          <button style={primaryBtnStyle} onClick={() => setShowAddVideo(!showAddVideo)}>
            {showAddVideo ? '× Annuler' : '+ Ajouter'}
          </button>
        }
      >
        {showAddVideo && (
          <div style={addCardStyle}>
            <input style={inputStyle} placeholder="Titre *" value={newVideo.titre}
              onChange={e => setNewVideo({ ...newVideo, titre: e.target.value })} />
            <input style={inputStyle} placeholder="ID YouTube * (ex: dQw4w9WgXcQ)" value={newVideo.url}
              onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} />
            <input style={inputStyle} placeholder="Catégorie" value={newVideo.categorie}
              onChange={e => setNewVideo({ ...newVideo, categorie: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Durée (min)" value={newVideo.duree}
              onChange={e => setNewVideo({ ...newVideo, duree: e.target.value })} />
            <button style={primaryBtnStyle} onClick={handleAddVideo}>Créer</button>
          </div>
        )}

        <div style={gridStyle}>
          {videos.map(v => (
            <div key={v.id_video} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              {editingVideo === v.id_video ? (
                <div style={{ padding: '16px' }}>
                  <input style={inputStyle} value={editVideoData.titre}
                    onChange={e => setEditVideoData({ ...editVideoData, titre: e.target.value })} />
                  <input style={inputStyle} value={editVideoData.url}
                    onChange={e => setEditVideoData({ ...editVideoData, url: e.target.value })} />
                  <input style={inputStyle} value={editVideoData.categorie}
                    onChange={e => setEditVideoData({ ...editVideoData, categorie: e.target.value })} />
                  <input style={inputStyle} type="number" value={editVideoData.duree}
                    onChange={e => setEditVideoData({ ...editVideoData, duree: e.target.value })} />
                  <div style={cardActionsStyle}>
                    <button style={primaryBtnStyle} onClick={() => handleSaveVideo(v.id_video)}>Enregistrer</button>
                    <button style={secondaryBtnStyle} onClick={() => setEditingVideo(null)}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
                    <img
                      src={`https://img.youtube.com/vi/${v.url}/mqdefault.jpg`}
                      alt={v.titre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#000', margin: '0 0 6px 0', lineHeight: 1.3 }}>{v.titre}</h3>
                    <p style={{ fontSize: '12px', color: '#555', margin: '0 0 12px 0' }}>
                      {v.categorie && <span style={{ color: '#6F7BFF', fontWeight: 600 }}>{v.categorie}</span>}
                    </p>
                    <div style={cardActionsStyle}>
                      <button style={editBtnStyle} onClick={() => startEditVideo(v)}>Modifier</button>
                      <button style={dangerBtnStyle} onClick={() => setConfirmDelete({ type: 'video', id: v.id_video, name: v.titre })}>Supprimer</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          {videos.length === 0 && (
            <p style={emptyStyle}>Aucune vidéo. Clique sur "+ Ajouter" pour en créer une.</p>
          )}
        </div>
      </Section>

      {confirmDelete && (
        <ConfirmModal
          message={`Supprimer "${confirmDelete.name}" ? Cette action est irréversible.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

const StatBox = ({ label, value }) => (
  <div style={{
    backgroundColor: '#6F7BFF',
    borderRadius: '16px',
    padding: '20px 12px',
    color: '#fff',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: '12px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{label}</div>
  </div>
);

const Section = ({ title, count, action, children }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#000' }}>
        {title} {count !== undefined && <span style={{ color: '#555', fontWeight: 400, fontSize: '14px' }}>({count})</span>}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '14px',
};

const cardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const addCardStyle = {
  backgroundColor: '#fff',
  border: '2px dashed #6F7BFF',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const cardActionsStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: 'auto',
  paddingTop: '8px',
};

const pointsBadgeStyle = {
  backgroundColor: '#6F7BFF',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: '20px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const inputStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  color: '#555',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  marginBottom: '8px',
};

const primaryBtnStyle = {
  padding: '10px 16px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#6F7BFF',
  color: '#fff',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const secondaryBtnStyle = {
  padding: '8px 14px',
  borderRadius: '10px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  color: '#555',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const editBtnStyle = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  color: '#6F7BFF',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const dangerBtnStyle = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  color: '#dc2626',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const emptyStyle = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  color: '#555',
  fontSize: '14px',
  padding: '32px 16px',
  margin: 0,
};

export default Admin;
