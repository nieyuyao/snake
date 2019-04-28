import GameMap from './GameMap';
import Controller from './Controller';
import Event from './Event';
import EventController from './EventController';
import Snake from './Snake';
import Snake2 from './Snake2';
import FoodsManager from './FoodsManager';
import SnakeManager from './SnakeManager';
import Ai from './Ai';

class Game {
	constructor(app) {
		this.name = 'game';
		this.app = app;
	}
	init() {
		this.foodsManager = new FoodsManager(this.app);
		this.map = new GameMap(this.app);
		this.mySnake = new Snake();
		this.controller = new Controller(this.app, this.map, this.mySnake);
		this.snakeManager = new SnakeManager(this.app);
		this.ai = new Ai(this.app, this.snakeManager);
		// 初始化地图
		this.map.init();
		// 初始化控制器
		this.controller.init();
		this.snakeManager.init();
		this.foodsManager.init();
		const {
			map,
			controller,
			app,
			foodsManager
		} = this;
		app.stage.addChild(map.sprite);
		app.stage.addChild(foodsManager.sprite);
		app.stage.addChild(controller.container);
		this.snakeManager.setMySnake(this.mySnake);
		this.ai.addSnake(new Snake2());
		this.initEventListeners();
	}
	/**
	 * 初始化事件
	 */
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
	/**
	 * 重启游戏
	 */
	restart() {}
	/**
	 * 启动游戏
	 */
	start() {}
}
export default Game;