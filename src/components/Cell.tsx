import React from 'react';
import { Cell as CellType } from '../services/GameService';
import './Cell.css';

interface CellProps {
    cell: CellType;
    onClick: (row: number, col: number) => void;
    isCurrentPlayerTurn: boolean;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, isCurrentPlayerTurn }) => {
    const handleClick = () => {
        if (!cell.revealed && isCurrentPlayerTurn) {
            onClick(cell.row, cell.column);
        }
    };

    const getCellContent = () => {
        if (!cell.revealed) {
            return cell.flagged ? '🚩' : '';
        }

        if (cell.mine) {
            return '💣';
        }

        return cell.adjacentMines > 0 ? cell.adjacentMines : '';
    };

    const getCellClass = () => {
        let className = 'game-cell';
        
        if (cell.revealed) {
            className += ' revealed';
            if (cell.mine) {
                className += ' mine';
            } else if (cell.adjacentMines > 0) {
                className += ` adjacent-${cell.adjacentMines}`;
            }
        }
        
        return className;
    };

    return (
        <div 
            className={getCellClass()}
            onClick={handleClick}
        >
            {getCellContent()}
        </div>
    );
};

export default Cell; 