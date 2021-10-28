import Phaser from "phaser";
import { CharacterSprite } from "../CharacterSprite";
import { CST } from "../CST";
import { Sprite } from "../Sprite";
// import { MenuScene } from "./MenuScene";

export class PlayScene extends Phaser.Scene {
    anna!: Phaser.Physics.Arcade.Sprite
    hooded!: Phaser.Physics.Arcade.Sprite
    keyboard!: { [index: string]: Phaser.Input.Keyboard.Key }
    assassins!: Phaser.Physics.Arcade.Group
    fireAttack!: Phaser.Physics.Arcade.Group
    constructor() {
        super({
            key: CST.SCENE.PLAY
        })
    }
    init() {

    }
    preload() {
        // anna的四个方向的运动
        this.anims.create({
            key: 'left',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 9,
                end: 17
            })
        })
        this.anims.create({
            key: 'right',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 27,
                end: 35
            })
        })
        this.anims.create({
            key: 'up',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 0,
                end: 8
            })
        })
        this.anims.create({
            key: 'down',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 18,
                end: 26
            })
        })
        // 火焰
        this.anims.create({
            key: "blaze",
            frameRate: 10,
            frames: this.anims.generateFrameNames("daze", {
                prefix: 'fire0',
                suffix: '.png',
                end: 5
            }),
            // repeat: -1,
            showOnStart: true,
            hideOnComplete: true
        })
        // 纹理
        this.textures.addSpriteSheetFromAtlas("hooded", {
            frameWidth: 64,
            frameHeight: 64,
            atlas: 'characters',
            frame: 'hooded'
        })

        // 在该游戏场景加载游戏地图
        this.load.image('terrain', 'src/assets/image/terrain_atlas.png')
        this.load.image('items', 'src/assets/image/items.png')

        this.load.tilemapTiledJSON('mappy', 'src/assets/maps/mappy.json')

    }
    create() {
        // let cat = this.add.sprite(100, 100, CST.SPRITE.CAT).setScale(2)
        let cat = new Sprite(this, 100, 100, CST.SPRITE.CAT)
        // this.anna = this.physics.add.sprite(400, 400, 'anna', 26).setScale(2)
        this.anna = new CharacterSprite(this, 400, 400, 'anna', 26)
        // this.hooded = this.physics.add.sprite(200, 200, 'hooded', 26).setScale(2).setImmovable(true) // 设置不可移动的
        this.hooded = new CharacterSprite(this, 200, 200, 'hooded', 26)

        this.fireAttack = this.physics.add.group()
        this.assassins = this.physics.add.group({ immovable: true })
        this.assassins.add(this.hooded)
        /**
         * 监听动画事件
         * animationstart
         * animationrepeat
         * animationupdate
         * animationcomplete
         */

        this.anna.setSize(35, 50).setOffset(14, 12)
        this.anna.setCollideWorldBounds(true)

        // @ts-ignore
        this.keyboard = this.input.keyboard.addKeys("w, a, s, d");
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                let fire = this.add.sprite(pointer.worldX, pointer.worldY, 'daze', 'fire00.png').play('blaze')
                this.fireAttack.add(fire)
                fire.on('animationcomplete', () => {
                    fire.destroy()
                })
            }
        })
        this.physics.world.addCollider(this.anna, this.assassins, (anna, assassins) => {
            // 碰撞检测
            anna.destroy()
            assassins.destroy()
        })
        this.physics.world.addCollider(this.fireAttack, this.assassins, (fireAttack, assassins) => {
            fireAttack.destroy()
            assassins.destroy()
            let x = 0;
            let y = 0;
            switch (Phaser.Math.Between(0, 1)) {
                case 0: x = Phaser.Math.Between(0, this.game.renderer.width);
                    break;
                case 1: y = Phaser.Math.Between(0, this.game.renderer.height);
            }
            for (let i = 0; i < 2; i++) {
                this.assassins.add(this.physics.add.sprite(x, y, 'hooded', 26).setScale(2).setImmovable(true)) // 设置不可移动的
            }
        })
        let mappy = this.add.tilemap('mappy') // 添加json文件
        let terrain = mappy.addTilesetImage('terrain_atlas', 'terrain') // 为json添加对应的图片
        let item = mappy.addTilesetImage('items')
        // 添加图层
        let botLayer = mappy.createLayer("bot", [terrain], 0, 0).setDepth(-1)
        let topLayer = mappy.createLayer("top", [terrain], 0, 0).setDepth(2)
        this.physics.add.collider(this.anna, topLayer)
        topLayer.setCollisionByProperty({ collides: true }) // 通过属性来设置碰撞
        topLayer.setCollision([269, 270, 271, 301, 302, 303, 333, 334, 335]) // 通过index来设置
        
        // 碰撞回调
        topLayer.setTileLocationCallback(10, 8, 1, 1, () => {
            alert('卧槽！！')
            // @ts-ignore
            topLayer.setTileLocationCallback(10, 8, 1, 1, null)
        }) //通过地图位置类获得碰撞回调
        // @ts-ignore
        topLayer.setTileIndexCallback([269, 270, 271, 301, 302, 303, 333, 334, 335], () => {
            alert('这咋有个洞？？')
            // @ts-ignore
            topLayer.setTileIndexCallback([269, 270, 271, 301, 302, 303, 333, 334, 335], null)
        })

        let items = mappy.createFromObjects('pickup', { key: CST.SPRITE.CAT }).map((sprite: Phaser.GameObjects.Sprite) => {
            sprite.setScale(2)
            sprite.setInteractive() // 可交互的
        })
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite) => {
            obj.destroy()
        })
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            let tile = mappy.getTileAt(mappy.worldToTileX(pointer.x), mappy.worldToTileY(pointer.y)) //获取到鼠标点击位置的tile元素
            console.log(tile)
        })

        this.cameras.main.startFollow(this.anna)
        this.physics.world.setBounds(0, 0, mappy.widthInPixels, mappy.heightInPixels)

        topLayer.renderDebug(this.add.graphics(), {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 122, 200),
            faceColor: new Phaser.Display.Color(243, 134, 122, 200)
        })
    }
    update(time: number, delta: number) {
        // time: 总时间  delta：每毫秒的帧数
        // this.physics.world.collide(this.anna, this.hooded, (anna, hooded) => {
        //     // 碰撞检测
        //     console.log(anna, hooded)
        //     anna.destroy()
        //     hooded.destroy()
        // })
        for (let i = 0; i < this.assassins.getChildren().length; i++) {
            this.physics.accelerateToObject(this.assassins.getChildren()[i], this.anna) // 让hooded去追anna
        }
        if (this.anna.active === true) {
            if (this.keyboard.w.isDown === true) {
                // this.anna.y -= 100 * (delta / 1000)
                this.anna.setVelocityY(-128)
                // this.anna.play('up', true)
            }
            else if (this.keyboard.a.isDown === true) {
                // this.anna.x -= 128 * (delta / 1000)
                this.anna.setVelocityX(-128)
                // this.anna.play('left', true)
            }
            else if (this.keyboard.d.isDown === true) {
                // this.anna.x += 128 * (delta / 1000)
                this.anna.setVelocityX(128)
                // this.anna.play('right', true)
            }
            else if (this.keyboard.s.isDown === true) {
                // this.anna.y += 128 * (delta / 1000)
                this.anna.setVelocityY(128)
                // this.anna.play('down', true)
            }
            if (this.keyboard.a.isUp && this.keyboard.d.isUp) {
                
                this.anna.setVelocityX(0)
            }
            if (this.keyboard.w.isUp && this.keyboard.s.isUp) {
                this.anna.setVelocityY(0)
            }

            // 在速度发生变化后 设置动画
            if (this.anna.body.velocity.x > 0) {
                this.anna.play('right', true)
            }
            else if (this.anna.body.velocity.x < 0) {
                this.anna.play('left', true)
            }
            else if (this.anna.body.velocity.y > 0) {
                this.anna.play('down', true)
            }
            else if (this.anna.body.velocity.y < 0) {
                this.anna.play('up', true)
            }
        }
    }
}