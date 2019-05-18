import GameMap from './GameMap';
import Controller from './Controller';
import Event from './event/Event';
import EventController from './event/EventController';
import FoodsManager from './food/FoodsManager';
import SnakeManager from './snake/SnakeManager';
import Ai from './Ai';

class Game {
	constructor(app) {
		this.name = 'game';
		this.app = app;
	}
	init() {
		this.foodsManager = new FoodsManager();
		this.snakeManager = new SnakeManager();
		this.gameMap = new GameMap(this.app);
		const mySnake = this.snakeManager.createSnake();
		this.controller = new Controller(this.app, this.gameMap, this.snakeManager, mySnake);
		this.ai = new Ai(this.snakeManager);
		this.foodsManager.init(this.snakeManager);
		this.snakeManager.init();
		// 初始化地图
		this.gameMap.init(this.foodsManager, this.snakeManager, mySnake);
		// 初始化控制器
		this.controller.init();
		const {
			gameMap,
			controller,
			app,
			ai
		} = this;
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		app.stage.addChild(gameMap.container);
		app.stage.addChild(controller.container);
		this.initEventListeners();
		this.start();
	}
	/**
	 * 初始化事件
	 */
	initEventListeners() {
		const { app } = this;
		// app.view.addEventListener('pointerenter', (e) => {
		// 	EventController.publish(new Event('pointerenter', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });
		// app.view.addEventListener('pointerleave', (e) => {
		// 	EventController.publish(new Event('pointerleave', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });
		// app.view.addEventListener('pointerdown', (e) => {
		// 	EventController.publish(new Event('pointerdown', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });
		// app.view.addEventListener('pointermove', (e) => {
		// 	EventController.publish(new Event('pointermove', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });
		// app.view.addEventListener('pointerup', (e) => {
		// 	EventController.publish(new Event('pointerup', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });
		// app.view.addEventListener('pointerout', (e) => {
		// 	EventController.publish(new Event('pointerout', { 
		// 		x: e.clientX, y: e.clientY
		// 	}));
		// });

		// pointer事件在移动端没有
		app.view.addEventListener('touchstart', (e) => {
			EventController.publish(new Event('pointerdown', [
				{x: e.touches[0].clientX, y: e.touches[0].clientY},
				{x: e.touches[1] ? e.touches[1].clientX : -1, y: e.touches[1] ? e.touches[1].clientY : -1}
			]));
		});
		app.view.addEventListener('touchmove', (e) => {
			EventController.publish(new Event('pointermove', [
				{x: e.touches[0].clientX, y: e.touches[0].clientY},
				{x: e.touches[1] ? e.touches[1].clientX : -1, y: e.touches[1] ? e.touches[1].clientY : -1}
			]));
		});
		app.view.addEventListener('touchend', () => {
			EventController.publish(new Event('pointerup'));
		});
	}
	/**
	 * 重启游戏
	 */
	restart() {}
	/**
	 * 启动游戏
	 */
	start() {
		const { app, gameMap } = this;
		app.ticker.add(gameMap.update, gameMap);
	}
}
export default Game;