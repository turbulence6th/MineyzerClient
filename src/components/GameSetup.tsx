import React, { useState, useEffect } from 'react';
import { Game, GameService } from '../services/GameService';
import './GameSetup.css';

interface GameSetupProps {
    onGameStart: (game: Game, username: string) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
    const [username, setUsername] = useState('');
    const [rows, setRows] = useState(8);
    const [columns, setColumns] = useState(8);
    const [mineCount, setMineCount] = useState(10);
    const [availableGames, setAvailableGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        loadAvailableGames();

        // Ekran boyutunu izle
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadAvailableGames = async () => {
        try {
            setLoading(true);
            const games = await GameService.getAllGames();
            // Sadece 1 oyunculu (bekleyen) oyunları göster
            setAvailableGames(games.filter(game => game.players.length === 1 && !game.gameOver));
        } catch (err) {
            setError('Mevcut oyunlar yüklenirken hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGame = async () => {
        if (!username.trim()) {
            setError('Lütfen bir kullanıcı adı giriniz');
            return;
        }

        try {
            setLoading(true);
            const newGame = await GameService.createGame(rows, columns, mineCount);
            const joinedGame = await GameService.joinGame(newGame.id, username);
            onGameStart(joinedGame, username);
        } catch (err) {
            setError('Oyun oluşturulurken bir hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGame = async (gameId: string) => {
        if (!username.trim()) {
            setError('Lütfen bir kullanıcı adı giriniz');
            return;
        }

        try {
            setLoading(true);
            const joinedGame = await GameService.joinGame(gameId, username);
            onGameStart(joinedGame, username);
        } catch (err) {
            setError('Oyuna katılırken bir hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="game-setup">
            <h1 className="game-setup-title">Mayın Tarlası Çevrimiçi</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="username-input">
                <label htmlFor="username" className="username-input-label">Kullanıcı Adı:</label>
                <input 
                    type="text"
                    id="username"
                    className="username-input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            
            <div className="game-creation">
                <h2 className="game-creation-title">Yeni Oyun Oluştur</h2>
                
                <div className={`game-settings ${isMobile ? 'column' : 'row'}`}>
                    <div className="setting">
                        <label htmlFor="rows" className="setting-label">Satır:</label>
                        <input 
                            type="number" 
                            id="rows"
                            className="setting-input"
                            min="4" 
                            max="16"
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                        />
                    </div>
                    <div className="setting">
                        <label htmlFor="columns" className="setting-label">Sütun:</label>
                        <input 
                            type="number" 
                            id="columns"
                            className="setting-input"
                            min="4" 
                            max="16"
                            value={columns}
                            onChange={(e) => setColumns(Number(e.target.value))}
                        />
                    </div>
                    <div className="setting">
                        <label htmlFor="mines" className="setting-label">Mayın Sayısı:</label>
                        <input 
                            type="number" 
                            id="mines"
                            className="setting-input"
                            min="1" 
                            max={Math.floor(rows * columns / 3)}
                            value={mineCount}
                            onChange={(e) => setMineCount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <button 
                    className="create-game-btn"
                    onClick={handleCreateGame}
                    disabled={loading || !username.trim()}
                >
                    {loading ? 'Oluşturuluyor...' : 'Oyun Oluştur'}
                </button>
            </div>
            
            <div className="available-games">
                <h2 className="available-games-title">Mevcut Oyunlar</h2>
                
                <div className="refresh-button-container">
                    <button 
                        className="refresh-button"
                        onClick={loadAvailableGames} 
                        disabled={loading}
                    >
                        {loading ? 'Yükleniyor...' : 'Yenile'}
                    </button>
                </div>
                
                {loading ? (
                    <p className="loading-text">Yükleniyor...</p>
                ) : availableGames.length > 0 ? (
                    <ul className="games-list">
                        {availableGames.map(game => (
                            <li key={game.id} className="game-item">
                                <span className="game-info-text">
                                    <strong>{game.players[0]?.username}</strong>'in oyunu 
                                    ({game.rows}x{game.columns}, {game.mineCount} mayın)
                                </span>
                                <button 
                                    className="join-game-btn"
                                    onClick={() => handleJoinGame(game.id)}
                                    disabled={loading || !username.trim()}
                                >
                                    Katıl
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-games-message">
                        Şu anda katılabileceğiniz bir oyun bulunmuyor.
                    </p>
                )}
            </div>
        </div>
    );
};

export default GameSetup; 