import Phaser from "phaser";
import { CST } from "../CST";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.MENU
        })
    }
    init() {
        // console.log(data) //接收消息
        // console.log('我收到了')
    }
    preload() {}
    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, CST.IMAGE.LOGO).setDepth(1) // 相当于zindex
        this.add.image(400, 300, CST.IMAGE.TITle).setDepth(0)
        const play_btn = this.add.image(400, 300, CST.IMAGE.PLAY)
        const option_btn = this.add.image(400, 400, CST.IMAGE.OPTION)

        const cat_hover = this.add.sprite(100, 100, CST.SPRITE.CAT).setScale(2)
        cat_hover.setVisible(false) // 设置不可见

        play_btn.setInteractive() // 设置为可交互的
        option_btn.setInteractive()
        cat_hover.setInteractive()

        /**
         * pointerover
         * pointerout
         * pointerup    单击弹起后触发
         * pointerdown  单击出发
         */
        play_btn.on('pointerover', () => { // 监听事件
            cat_hover.setVisible(true)
            cat_hover.x = play_btn.x - play_btn.width // 设置猫咪出现在这个按钮的左侧
            cat_hover.y = play_btn.y
            cat_hover.play('walk')
        })
        play_btn.on('pointerout', () => { 
            cat_hover.setVisible(false)
        })
        option_btn.on('pointerover', () => {
            console.log(13)
            cat_hover.setVisible(true)
            cat_hover.x = option_btn.x - option_btn.width // 设置猫咪出现在这个按钮的左侧
            cat_hover.y = option_btn.y
        })
        option_btn.on('pointerout', () => {
            cat_hover.setVisible(false)
        })


        // 播放音乐
        // this.sound.pauseOnBlur = false
        // this.sound.play('title_music', { loop: true })


        // 动画
        this.anims.create({
            key: 'walk',
            frameRate: 10, // 速度 表示1s 几帧
            repeat: -1, // 循环
            frames: this.anims.generateFrameNumbers(CST.SPRITE.CAT, {frames: [0, 1, 2, 3]})
        })

    }
    update() {

    }
}