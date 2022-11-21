import Phaser from 'phaser'

const formatScore = (score) => `Score: ${score}`;

/**
 * se crea un gameObject tipo Text para mostrar la puntuacion del jugador 
 * en la pantalla
 */
export default class ScoreLabel extends Phaser.GameObjects.Text{
    constructor(scene, x, y, score, style){
        super(scene, x, y, formatScore(score), style)
        this.score = score;
    }

    /**
     * setea el score
     * @param {*} score 
     */
    setScore(score){
        this.score = score;
        this.updateScoreText();
    } 
    /**
     * meotodo para sumar la puntuacion del jugador
     * @param {*} points 
     */
    add(points){
        this.setScore(this.score + points)
    }

    /**
     * actualiza la variable formatScore que la variable que mostrara
     * la puntuacion del jugador
     */
    updateScoreText(){
        this.setText(formatScore(this.score));
    }
}