import { useState, useCallback } from 'react';
import { api } from '../api/client';

export const useJokes = () => {
    const [joke, setJoke] = useState('Загрузка...');
    const [loading, setLoading] = useState(false);

    const fetchRandom = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api('/joke/random');
            setJoke(data.content);
        } catch (err) {
            setJoke(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const postJoke = async (content, token) => {
        return await api('/joke/add', { method: 'POST', body: { content }, token });
    };

    return { joke, loading, fetchRandom, postJoke };
};