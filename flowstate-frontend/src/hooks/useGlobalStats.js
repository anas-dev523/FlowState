import { useState, useEffect } from 'react';
import { getGlobalStats } from '../services/api';

export function useGlobalStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getGlobalStats().then(res => setStats(res.data));
  }, []);

  return stats;
}
