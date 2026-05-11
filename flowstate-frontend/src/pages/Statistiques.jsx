import { useNavigate } from 'react-router-dom';
import { useGlobalStats } from '../hooks/useGlobalStats';
import { useDailyCompletion } from '../hooks/useDailyCompletion';
import StatCard from '../components/StatCard';
import ReturnArrow from '../components/ReturnArrow';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend} from 'recharts';
function Statistiques() {
  const globalstats = useGlobalStats();
  const dailyCompletion = useDailyCompletion(14);
  const navigate = useNavigate();

  if (!globalstats) return <p>Chargement...</p>;

  const pieData = [
    { name: 'Validés', value: globalstats.validatedCount },
    { name: 'Manqués', value: globalstats.missedDays },
  ];

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: '100vh',
    }}>
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
          Tes statistiques
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <StatCard value={globalstats.score} label="Score" />
        <StatCard value={globalstats.validatedCount} label="Validés" />
        <StatCard value={globalstats.missedDays} label="Manqués" />
        <StatCard value={globalstats.focusSessions} label="Sessions" />
        <StatCard value={globalstats.focusMinutes} label="Minutes" />
      </div>
      <h2>Taux de complétion (14 derniers jours)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dailyCompletion}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="percent" stroke="#6F7BFF" fill="#6F7BFF" />
      </AreaChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: '32px' }}>Répartition validés / manqués</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            <Cell fill="#6F7BFF" />
            <Cell fill="#cfc7c7" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default Statistiques;
