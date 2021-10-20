import Phaser from 'phaser';
import sky from './assets/sky.png';
import dude from './assets/dude.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    this.player;
    this.platforms;
    this.cursors;
    this.stars;
    this.score = 0;
    this.scoreText;
    this.bombs;
    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("ground", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.add.image(400, 300, "sky"); // 添加背景

    // 平台
    this.platforms = this.physics.add.staticGroup(); // 添加平台
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    // 游戏人物
    this.player = this.physics.add.sprite(100, 100, "dude"); // 添加玩家
    this.player.setBounce(0.3); // 添加弹性
    this.player.setCollideWorldBounds(true); // 添加玩家不跳出画布

    // 动画
    this.anims.create({
      // 添加动画
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }), // 关键帧
      frameRate: 60, // 一秒10帧
      repeat: -1, // 重复
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 60,
      repeat: -1,
    });

    // 键盘
    this.cursors = this.input.keyboard.createCursorKeys();

    // 星星
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // 循环给每个星星设置弹力
    });

    // 计分
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    // 炸弹
    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this); // 重叠检测
    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200); // 速度

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-450);
    }
  }
  collectStar(player, star) {
    // 重叠触发函数
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("score: " + this.score);
    // 每吃一个星星 都跳出来一个炸弹
    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      var bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocityX(Phaser.Math.Between(-200, 200), 20);
    }
  }
  hitBomb(player, bomb) {
    // player.disableBody(true, true)
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;
  }
}

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
  scene: MyGame
};

const game = new Phaser.Game(config);
