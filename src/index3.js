import Phaser from 'phaser';
import sky from './assets/sky.png';
import dude from './assets/dude.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';

var config = {
    type: Phaser.AUTO, // 渲染模式
    width: 800, // 画布宽高
    height: 600,
    physics: { // 物理引擎
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: { // 场景
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;

new Phaser.Game(config);

function preload() {
    // 加载资源
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky'); // 添加背景

    // 平台
    platforms = this.physics.add.staticGroup(); // 添加平台
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // 游戏人物
    player = this.physics.add.sprite(100, 100, 'dude'); // 添加玩家
    player.setBounce(0.3); // 添加弹性
    player.setCollideWorldBounds(true); // 添加玩家不跳出画布

    // 动画
    this.anims.create({ // 添加动画
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), // 关键帧
        frameRate: 60, // 一秒10帧
        repeat: -1 // 重复
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 60,
        repeat: -1
    });

    // 键盘
    cursors = this.input.keyboard.createCursorKeys();

    // 星星
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // 循环给每个星星设置弹力
    });

    // 计分
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // 炸弹
    bombs = this.physics.add.group();


    this.physics.add.collider(player, platforms); 
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this); // 重叠检测
    this.physics.add.overlap(player, bombs, hitBomb, null, this)

}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-200); // 速度

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(200);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-450);
    }
}
function collectStar(player, star) {
    // 重叠触发函数
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('score: ' + score);
    // 每吃一个星星 都跳出来一个炸弹
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)
        })
        var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocityX(Phaser.Math.Between(-200, 200), 20);
    }
}
function hitBomb(player, bomb) {
    // player.disableBody(true, true)
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    gameOver = true
}