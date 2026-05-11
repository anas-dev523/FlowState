import { useState, useEffect } from 'react';
import { getDailyCompletion } from '../services/api';

export function useDailyCompletion(days = 14) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDailyCompletion(days).then(res => setData(res.data));
  }, [days]);

  return data;
}
