import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReturnArrow from "../components/ReturnArrow";
import VideoCard from "../components/VideoCard";

function Motivation() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const videos = [
    {
      titre: 'The Power of Discipline',
      url: 'g-jwWYX7Jlo',
      categorie: 'discipline',
      duree: 10,
    },
    {
      titre: 'MINDSET IS EVERYTHING',
      url: 'ZtMm0swu5i8',
      categorie: 'mindset',
      duree: 15,
    },
    {
      titre: 'BELIEVE IN YOURSELF',
      url: '26U_seo0a1g',
      categorie: 'mindset',
      duree: 8,
    },
  ];

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: '100vh',
    }}>
      {selectedVideo === null ? (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <ReturnArrow onClick={() => navigate("/Dashboard")} />
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              margin: 0,
              color: '#000',
            }}>
              Trouvez l'inspiration et gardez le cap
            </h1>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {videos.map((video) => (
              <VideoCard
                key={video.url}
                titre={video.titre}
                url={video.url}
                duree={video.duree}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <ReturnArrow onClick={() => setSelectedVideo(null)} />
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#000',
            marginBottom: '16px',
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.url}?autoplay=1`}
              title={selectedVideo.titre}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>

          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 6px 0',
            color: '#000',
          }}>
            {selectedVideo.titre}
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#999',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {selectedVideo.categorie} · {selectedVideo.duree} min
          </p>
        </>
      )}
    </div>
  );
}

export default Motivation;
