const BASE_URL = 'https://api.themoviedb.org/3';

const getApiKey = () => localStorage.getItem('tmdb_api_key');

export const searchMulti = async (query) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
};

export const getDetails = async (type, id) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Fetch details failed');
    return response.json();
};

export const getRecommendations = async (type, id) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Fetch recommendations failed');
    return response.json();
};

export const getWatchProviders = async (type, id) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}/watch/providers?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Fetch watch providers failed');
    return response.json();
};
