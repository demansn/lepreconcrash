import {Container, Graphics} from "pixi.js";
import gsap from 'gsap';

export class WinAnimation extends Container {
    play() {
        // generate 50 spars animation from 0 position to random radius with random angle use gsap
        // after animation complete call resolve
        const promises = [];

        for (let i = 0; i < 50; i += 1) {
            const spark = new Graphics();
            // gold color
            spark.beginFill(0xFFD700);
            spark.drawCircle(0, 0, 10);
            spark.endFill();
            spark.x = 0;
            spark.y = 0;
            this.addChild(spark);

            const randomDirection = Math.random() * Math.PI * 2;

           promises.push( gsap.to(spark, {
               duration: 1,
               delay: 1 + Math.random(),
                x: Math.random() * 300 * Math.cos(randomDirection),
                y: Math.random() * 300 * Math.sin(randomDirection),
                alpha: 0,
                rotation: Math.random() * Math.PI * 2,
                onComplete: () => {
                    this.removeChild(spark);
                }
            }));
        }

        return Promise.all(promises);
    }
}
