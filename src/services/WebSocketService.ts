import { Client, Message } from '@stomp/stompjs';
import { Game } from './GameService';

class WebSocketService {
    private client: Client | null = null;
    private gameUpdateCallback: ((game: Game) => void) | null = null;

    init(gameId: string, onGameUpdate: (game: Game) => void) {
        this.gameUpdateCallback = onGameUpdate;

        this.client = new Client({
            // Doğrudan WebSocket kullan
            brokerURL: 'ws://localhost:8080/ws',
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('WebSocket bağlantısı kuruldu.');
            
            this.client?.subscribe(`/topic/games/${gameId}`, (message: Message) => {
                if (this.gameUpdateCallback) {
                    const game: Game = JSON.parse(message.body);
                    this.gameUpdateCallback(game);
                }
            });
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP hatası: ' + frame.headers['message']);
            console.error('İlave detaylar: ' + frame.body);
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client && this.client.connected) {
            this.client.deactivate();
            console.log('WebSocket bağlantısı kapatıldı.');
        }
    }
}

export default new WebSocketService(); 