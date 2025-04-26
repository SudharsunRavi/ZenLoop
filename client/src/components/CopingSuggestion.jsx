import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

const CopingSuggestion = () => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = useSelector((state) => state?.user?.currentUser?._id);

  const fetchSuggestion = async () => {
    setLoading(true);
    setError('');
    setSuggestion('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/copingsuggestion`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuggestion(data.suggestion);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to fetch suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSuggestion();
    }
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl mx-auto font-semibold">Coping Suggestion</h2>
      </div>

      {loading && (
        <div className="text-blue-500 mb-4">
          Generating your personalized suggestion...
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="p-4 bg-blue-50 rounded-xl shadow-inner text-justify text-gray-700 whitespace-pre-line h-64 overflow-y-auto">
          {suggestion}
        </div>
      )}
    </div>
  );
};

export default CopingSuggestion;