import { useState, useEffect } from 'react';
import { getMyRewards } from '../services/rewards.service';

const useRewards = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await getMyRewards();
      setRewards(data.rewards);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { rewards, loading, error, refresh };
};

export default useRewards;
