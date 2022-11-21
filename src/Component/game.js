import Phaser from 'phaser';
import ScoreLabel from "./puntuacion";
import BombSpawner from './bombas';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'start';
const BOMB_KEY = 'bomb';
const SKY_KEY = 'sky';

class GameScene extends Phaser.Scene{
    constructor(){
        super('game-scene')
		
        this.player = undefined
        this.cursors = undefined
        this.starts = undefined
        this.BombSpawner = undefined
        this.gameOver = false
    }

    /**
     * metodo para cargar los assets que se van a utilizar en el juego
     */
    preload(){
        this.load.image(SKY_KEY, 'assets/sky.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image(STAR_KEY, 'assets/star.png')
		this.load.image(BOMB_KEY, 'assets/bomb.png')
        this.load.image(DUDE_KEY, 'assets/dude.png',{frameWidth: 32, frameHeight: 48});
    }

    /**
     * creal el escenario del juego
     */
    create(){
        this.add.image(400, 300, SKY_KEY);//adihere la imagen de fondo
        const platforms = this.createPlatforms();//genera las plataformas
        
        this.player = this.createPlayer()
        this.start = this.createStars()
        this.ScoreLabel = this.createScoreLabel(16, 16, 0)
        this.BombSpawner = new BombSpawner(this, BOMB_KEY)//se asigna a la variable el objeto tipo BombSpawner pasando por parametro la escena y el nombre del assets
        const bombGroup = this.BombSpawner.group;
        //se adihere la colision a cada uno de los objetos con la plataformas
        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.start, platforms)
        this.physics.add.collider(this.bombGroup, platforms)
        this.physics.add.collider(this.player, bombGroup, this.hitBomb, null, this)
        //------------------------------------------------------------
        this.physics.add.overlap(this.player, this.starts, this.collectStar, null, this)//agrega fluides a la colision
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    /**
     * dentro del metodo update actualizara constantemente el escenario
     * @returns 
     */
    update(){
        
        this.movePlayer();
    }

    movePlayer(){
        if(this.gameOver){
            return
        }
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }else if(this.cursors.right.isDown){
            this.player.setVelocity(160);
            this.player.anims.play('right', true);
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityX(-330);
        }
    }

    createPlatforms()
	{
		const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()
	
		platforms.create(600, 400, GROUND_KEY)
		platforms.create(50, 250, GROUND_KEY)
		platforms.create(750, 220, GROUND_KEY)

		return platforms
	}

    createPlayer()
	{
		const player = this.physics.add.sprite(100, 450, DUDE_KEY)
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

		return player
	}

    createStars()
	{
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		})
		
		stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}

    collectStar(player, star)
	{
		star.disableBody(true, true)
		this.scoreLabel.add(10)

		if (this.stars.countActive(true) === 0)
		{
			//  A new batch of stars to collect
			this.stars.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			})
			this.bombSpawner.spawn(player.x)
		}

	}

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

	hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}
}

export default GameScene;