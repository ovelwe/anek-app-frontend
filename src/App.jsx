import React, { useState, useEffect } from 'react';
import { useJokes } from './hooks/useJokes';
import { useAuth } from './hooks/useAuth';
import { api } from './api/client';
import './App.css';

export default function App() {
    const { user, login, logout, isAuthenticated } = useAuth();
    const { joke, loading, fetchRandom, postJoke } = useJokes();

    const [showAuth, setShowAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newContent, setNewContent] = useState('');

    useEffect(() => { fetchRandom(); }, [fetchRandom]);

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const data = await api(endpoint, { method: 'POST', body: { username, password } });
            if (isLogin) {
                login(data.token, data.username);
                setShowAuth(false);
            } else {
                alert('Регистрация успешна!');
                setIsLogin(true);
            }
            setUsername(''); setPassword('');
        } catch (err) { alert(err.message); }
    };

    const handlePublish = async () => {
        try {
            await postJoke(newContent, user.token);
            setNewContent(''); setIsAdding(false); fetchRandom();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1 className="accent-text">P.R.I.K.O.L ГЕНЕРАТОР</h1>
                {isAuthenticated && (
                    <div className="user-controls">
                        <span className="user-name">{user.username}</span>
                        <button className="btn-out" onClick={logout}>Exit</button>
                    </div>
                )}
            </header>

            <main className="content-center">
                <div className="joke-card">
                    {loading ? <span className="loader">загрузка...</span> : <p>{joke}</p>}
                </div>

                <div className="controls">
                    <button className="btn-main" onClick={fetchRandom}>Следующий p.r.i.k.o.l</button>
                    {isAuthenticated && (
                        <button className="btn-sub" onClick={() => setIsAdding(!isAdding)}>
                            {isAdding ? 'Отменить' : 'Добавить'}
                        </button>
                    )}
                </div>

                {!isAuthenticated && (
                    <div className="guest-action">
                        <p>Хочешь добавить свой мем?</p>
                        <button className="btn-sub" onClick={() => setShowAuth(true)}>Войти в систему</button>
                    </div>
                )}

                {isAdding && (
                    <div className="add-area">
                        <textarea
                            className="input-field"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="Напиши самую смешную штуку в мире"
                        />
                        <button className="btn-main" onClick={handlePublish}>Запостить</button>
                    </div>
                )}
            </main>

            {showAuth && (
                <div className="auth-overlay">
                    <div className="auth-modal">
                        <h2>{isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h2>
                        <form onSubmit={handleAuth}>
                            <input className="input-field" type="text" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required />
                            <input className="input-field" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
                            <button className="btn-main" type="submit">{isLogin ? 'ВОЙТИ' : 'СОЗДАТЬ'}</button>
                        </form>
                        <button className="btn-text" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
                        </button>
                        <button className="btn-sub" style={{width: '100%', marginTop: '10px'}} onClick={() => setShowAuth(false)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}