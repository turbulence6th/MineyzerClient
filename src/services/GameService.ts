import axios from 'axios';

const API_URL = 'http://localhost:8080/api/games';

export interface Cell {
    row: number;
    column: number;
    mine: boolean;
    revealed: boolean;
    flagged: boolean;
    adjacentMines: number;
}

export interface Player {
    id: string;
    username: string;
    score: number;
}

export interface Game {
    id: string;
    rows: number;
    columns: number;
    mineCount: number;
    gameOver: boolean;
    currentTurn: string;
    players: Player[];
    board: Cell[][];
}

export const GameService = {
    createGame: async (rows: number = 8, columns: number = 8, mineCount: number = 10): Promise<Game> => {
        const response = await axios.post(API_URL, { rows, columns, mineCount });
        return response.data;
    },

    getGame: async (gameId: string): Promise<Game> => {
        const response = await axios.get(`${API_URL}/${gameId}`);
        return response.data;
    },

    getAllGames: async (): Promise<Game[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    joinGame: async (gameId: string, username: string): Promise<Game> => {
        const response = await axios.post(`${API_URL}/${gameId}/join`, { username });
        return response.data;
    },

    makeMove: async (gameId: string, playerId: string, row: number, col: number): Promise<Game> => {
        const response = await axios.post(`${API_URL}/${gameId}/move`, { playerId, row, col });
        return response.data;
    }
}; 