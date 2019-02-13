import GameMap from './GameMap.js';
import Controller from './Controller.js';
import Event from './Event.js';
import EventController from './EventController.js';
import Snake from './Snake.js';

class Game {
	constructor(app) {
		this.name = 'game';
		this.app = app;
	}
	init() {
		this.snake = new Snake(this.app);
		this.map = new GameMap(this.app);
		this.controller = new Controller(this.app, this.map, this.snake);
		this.map.init();
		this.controller.init();
		this.snake.init();
		const {
			map,
			controller,
			snake,
			app
		} = this;
		app.stage.addChild(map.tilingSprite);
		app.stage.addChild(controller.container);
		app.stage.addChild(snake.container);
		this.initEventListeners();
	}
	initEventListeners() {
		const { app } = this;
		app.view.addEventListener('pointerenter', (e) => {
			EventController.publish(new Event('pointerenter', e.clientX, e.clientY));
		});
		app.view.addEventListener('pointerleave', (e) => {
			EventController.publish(new Event('pointerleave', e.clientX, e.clientY));
		});
		app.view.addEventListener('pointerdown', (e) => {
			EventController.publish(new Event('pointerdown', e.clientX, e.clientY));
		});
		app.view.addEventListener('pointermove', (e) => {
			EventController.publish(new Event('pointermove', e.clientX, e.clientY));
		});
		app.view.addEventListener('pointerup', (e) => {
			EventController.publish(new Event('pointerup', e.clientX, e.clientY));
		});
		app.view.addEventListener('pointerout', (e) => {
			EventController.publish(new Event('pointerout', e.clientX, e.clientY));
		});
	}
	restart() {}
	start() {}
}
export default Game;