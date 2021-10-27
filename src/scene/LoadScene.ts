import Phaser from "phaser";
import { CST } from "../CST";
// import { MenuScene } from "./MenuScene";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.LOAD
        })
    }
    init() {

    }
    loadImage() {
        this.load.setPath('src/assets/image')
        for (const key in CST.IMAGE) {
            //@ts-ignore
            this.load.image(CST.IMAGE[key], CST.IMAGE[key])
        }
    }
    loadAudio() {
        this.load.setPath('src/assets/audio')
        for (const key in CST.AUDIO) {
            //@ts-ignore
            this.load.audio(CST.AUDIO[key], CST.AUDIO[key])
        }
    }
    loadSprite(frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig) {
        this.load.setPath('src/assets/sprite')
        for (const key in CST.SPRITE) {
            //@ts-ignore
            this.load.spritesheet(CST.SPRITE[key], CST.SPRITE[key], frameConfig)
        }
    }
    preload() {

        this.load.spritesheet('anna', 'src/assets/sprite/anna.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.atlas('characters', 'src/assets/sprite/characters.png', 'src/assets/sprite/characters.json')
        this.load.atlas('daze', 'src/assets/sprite/daze.png', 'src/assets/sprite/daze.json')

        this.loadImage()
        this.loadAudio()
        this.loadSprite({
            frameWidth: 32,
            frameHeight: 32,
        })
        // 制作进度条
        let loadingBar = this.add.graphics({ // 生成一个图形
            fillStyle: {
                color: 0xffffff
            }
        })
        this.load.on('progress', (p: number) => { // 监听进度变化
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * p, 20) // 把图形添加上矩形
            console.log(p)
        })
        this.load.on('complete', () => { // 加载完成
            this.scene.start(CST.SCENE.MENU) // 场景跳转
        })

    }
    create() {
        // this.scene.add(CST.SCENE.MENU, MenuScene) // 动态加载场景 
        // this.scene.start(CST.SCENE.MENU, '跳转到了菜单页面') // 场景跳转
        // 场景切换 每个场景 都应该有一个key
    }
}