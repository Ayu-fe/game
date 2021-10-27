import Phaser from "phaser";
import { LoadScene } from "./scene/LoadScene";
import { MenuScene } from "./scene/MenuScene";
import { PlayScene } from './scene/PlayScene';

const game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    render: {
        pixelArt: true // 锐化 像素风
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
})