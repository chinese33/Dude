import Phaser from 'phaser';
import game from './game';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {
                y: 200
            }
        }
    },
    scene: [game]
}

export default new Phaser.Game(config)