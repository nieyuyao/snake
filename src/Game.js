import GameMap from './GameMap';
import Controller from './Controller';
import Event from './Event';
import EventController from './EventController';
import Snake from './Snake';
import FoodsManager from './FoodsManager';

class Game {
	constructor(app) {
		this.name = 'game';
		this.app = app;
	}
	init() {
		this.foodsManager = new FoodsManager(this.app);
		this.map = new GameMap(this.app);
		this.snake = new Snake(this.app);
		this.controller = new Controller(this.app, this.map, this.snake);
		this.map.init();
		this.controller.init();
		this.snake.init();
		this.foodsManager.init();
		const {
			map,
			controller,
			snake,
			app,
			foodsManager
		} = this;
		app.stage.addChild(map.sprite);
		app.stage.addChild(foodsManager.sprite);
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