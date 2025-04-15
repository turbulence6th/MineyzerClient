import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import { Game, Player } from '../services/GameService';
import './GameBoard.css';

interface GameBoardProps {
    game: Game;
    currentPlayer: Player | null;
    onMakeMove: (row: number, col: number) => void;
    onExitGame: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, currentPlayer, onMakeMove, onExitGame }) => {
    const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(false);
    const [cellSize, setCellSize] = useState(30);

    useEffect(() => {
        if (currentPlayer && game.currentTurn === currentPlayer.id) {
            setIsCurrentPlayerTurn(true);
        } else {
            setIsCurrentPlayerTurn(false);
        }
    }, [game.currentTurn, currentPlayer]);

   

    const handleCellClick = (row: number, col: number) => {
        if (isCurrentPlayerTurn && !game.gameOver) {
            onMakeMove(row, col);
        }
    };

    // Hesapla: oyun tahtasının sabit genişliği = sütun sayısı * hücre genişliği + (sütun sayısı - 1) * boşluk
    const cellGap = 3;
    
    // Aktif oyuncuyu belirle
    const activePlayerId = game.currentTurn;

    // Kazanan oyuncuyu belirle
    const winner = game.gameOver ? game.players.sort((a, b) => b.score - a.score)[0] : null;
    const isCurrentPlayerWinner = winner && currentPlayer && winner.id === currentPlayer.id;

    // Kalan mayın sayısını hesapla
    const revealedMineCount = game.board.flat().filter(cell => cell.revealed && cell.mine).length;
    const remainingMineCount = game.mineCount - revealedMineCount;

    // Rakip beklenip beklenmediğini kontrol et
    const isWaitingForOpponent = game.players.length < 2;

    // Game info panelinin sınıfını belirle
    const getGameInfoClass = () => {
        let className = "game-info";
        if (game.gameOver) {
            className += isCurrentPlayerWinner ? " game-info-win" : " game-info-loss";
        } else if (isWaitingForOpponent) {
            className += " game-info-waiting";
        } else {
            className += " game-info-normal";
        }
        return className;
    };

    return (
        <div className="game-board">
            <div 
                className={getGameInfoClass()}
               
            >
                <div className="game-info-header">
                    <button className="exit-game" onClick={onExitGame}>
                        Oyundan Çık
                    </button>
                </div>

                <div className={`turn-indicator ${'turn-indicator-large'}`}>
                    {game.gameOver ? (
                        <span className={isCurrentPlayerWinner ? 'winner-text' : 'loser-text'}>
                            {isCurrentPlayerWinner 
                                ? '🎉 Tebrikler! Kazandın! 🏆' 
                                : '😢 Maalesef kaybettin. 🔄'}
                        </span>
                    ) : isWaitingForOpponent ? (
                        <span className="waiting-opponent">
                            ⌛ Rakip Bekleniyor...
                        </span>
                    ) : (
                        isCurrentPlayerTurn 
                            ? <span className="your-turn">✨ Senin Sıran! ✨</span>
                            : <span className="waiting">⏳ Rakibin Oynuyor...</span>
                    )}
                </div>
                
                {/* Mayın sayacı */}
                <div className="mine-counter">
                    <div className="mine-counter-pill">
                        <span role="img" aria-label="bomb" className="mine-icon">💣</span>
                        <span>{remainingMineCount}</span>
                    </div>
                </div>
                
                <div className={`scores ${'scores-row'}`}>
                    {game.players.map(player => {
                        // Oyuncu skorunun sınıfını belirle
                        let playerScoreClass = 'player-score';
                        playerScoreClass += ' player-score-desktop';
                        
                        if (game.gameOver) {
                            playerScoreClass += player.id === winner?.id ? ' player-score-winner' : ' player-score-loser';
                        } else {
                            playerScoreClass += player.id === activePlayerId ? ' player-score-active' : ' player-score-inactive';
                        }
                        
                        return (
                            <div 
                                key={player.id} 
                                className={playerScoreClass}
                            >
                                <span className="player-name">{player.username}</span>: 
                                <span className={`score ${game.gameOver && player.id === winner?.id ? 'score-winner' : ''}`}>
                                    {player.score}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="board-container">
                <div 
                    className="board"
                    style={{ 
                        gridTemplateColumns: `repeat(${game.columns}, ${cellSize}px)`,
                        gap: `${cellGap}px`,
                        gridAutoRows: `${cellSize}px`
                    }}
                >
                    {/* Oyun beklenirken veya bittiğinde oyun alanını engelleyen katman */}
                    {(game.gameOver || isWaitingForOpponent) && (
                        <div className="board-overlay" />
                    )}
                    
                    {game.board.flat().map((cell) => (
                        <Cell 
                            key={`${cell.row}-${cell.column}`}
                            cell={cell}
                            onClick={handleCellClick}
                            isCurrentPlayerTurn={isCurrentPlayerTurn && !game.gameOver && !isWaitingForOpponent}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard; 