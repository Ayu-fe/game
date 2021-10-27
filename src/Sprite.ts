import Phaser from "phaser";

// Sprite类
export class Sprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frames?: number | string) {
        super(scene, x, y, texture, frames)
        scene.sys.updateList.add(this)
        scene.sys.displayList.add(this)
        this.setScale(2)
        this.setOrigin(0, 0)
    }
}