import Phaser from "phaser";

// CharacterSprite类
export class CharacterSprite extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frames?: number | string) {
        super(scene, x, y, texture, frames)
        scene.sys.updateList.add(this)
        scene.sys.displayList.add(this)
        scene.physics.world.enableBody(this)
        this.setScale(2)
        this.setOrigin(0, 0)
        this.setImmovable(true)
    }
}