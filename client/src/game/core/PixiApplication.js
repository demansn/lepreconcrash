import {Application} from "pixi.js";
import {Stage} from "@pixi/layers";

export class PixiApplication {
    async create(options) {
        this.app = new Application(options);
        this.app.stage = new Stage();
        this.app.stage.sortableChildren = true;

        window.__PIXI_APP__ =  this.app;

        this.container = document.getElementById(options.containerId);

        if (!this.container) {
            this.container = document.body;
        }

        this.container.appendChild(this.app.view);
    }

    getStage() {
        return this.app.stage;
    }

    getApp() {
        return this.app;
    }

    addChildToStage(child) {
        this.app.stage.addChild(child);
    }
}

