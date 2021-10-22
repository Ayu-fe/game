import Phaser from "phaser";
import { LoadScene } from "./scene/LoadScene";
import { MenuScene } from "./scene/MenuScene";

const game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [
        LoadScene, MenuScene
    ],
    render: {
        pixelArt: true // 锐化 像素风
    }
})