import {SuperContainer} from "./ObjectFactory";

export class Clouds extends SuperContainer {
    constructor({levelWidth, clodScale = 1, variants}) {
        super();

        this.clodScale = clodScale;
        this.variants = variants;
        this.clouds = [];

        let nextX = 0;

        while(nextX < levelWidth) {
            const cloud = this.addRandomCloud();
            cloud.x = nextX;

            this.clouds.push(cloud);

            nextX += cloud.width + (Math.random() * 20);
        }

    }

    addRandomCloud() {
        // add cloud to clouds array
        const randomCloudIndex = this.variants[Math.floor(Math.random() * this.variants.length)];

        return this.create.sprite({texture: `Cloud${randomCloudIndex}`, scale: {x: this.clodScale, y: this.clodScale}});
    }
}
