import { useState, useEffect } from 'react';

const fetchSpotifyToken = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const token = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
};

const fetchSongs = async () => {
    const token = await fetchSpotifyToken();
    const query = 'mind-relaxing calm hits meditation';
    const offset = Math.floor(Math.random() * 40);
  
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=7&offset=${offset}&market=IN`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
    return data.tracks.items || [];
};  

const SpotifyList = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const getTracks = async () => {
      const songs = await fetchSongs();
      setTracks(songs);
    };
    getTracks();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl flex justify-center font-medium mb-4">Suggested Songs</h2>

      <div className="space-y-3 overflow-y-auto flex-1">
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-4 p-2 rounded-lg shadow bg-blue-100">
              <img
                src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}
                alt={track.name}
                className="w-16 h-16 rounded"
              />
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">
                {track.name} <br />
                <span className="text-sm text-gray-600">{track.artists.map((artist) => artist.name).join(', ')}</span>
              </a>
            </div>
          ))
        ) : (
          <p>No tracks found.</p>
        )}
      </div>
    </div>
  );
};

export default SpotifyList;
