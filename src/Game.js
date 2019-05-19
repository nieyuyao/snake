import GameMap from './GameMap';
import Controller from './Controller';
import Event from './event/Event';
import EventController from './event/EventController';
import FoodsManager from './food/FoodsManager';
import SnakeManager from './snake/SnakeManager';
import { GAME_RESTART, GAME_OVER } from './utils/constants';
import Ai from './Ai';

class Game {
	constructor(app) {
		this.name = 'game';
		this.app = app;
	}
	init() {
		this.snakeManager = new SnakeManager();
		this.foodsManager = new FoodsManager(this.snakeManager);
		this.gameMap = new GameMap(this.app);
		const mySnake = this.snakeManager.createSnake();
		mySnake.isMine = true;
		mySnake.container.name = 'mySnake';
		this.controller = new Controller(this.app, this.gameMap, this.snakeManager);
		this.controller.setMySnake(mySnake);
		this.ai = new Ai(this.snakeManager);
		this.foodsManager.init();
		this.snakeManager.init();
		// 初始化地图
		this.gameMap.init(this.foodsManager, this.snakeManager);
		this.gameMap.setMySnake(mySnake);
		// 初始化控制器
		this.controller.init();
		const {
			gameMap,
			controller,
			app
		} = this;
		this.initAi();
		app.stage.addChild(gameMap.container);
		app.stage.addChild(controller.container);
		this.initEventListeners();
		this.start();
	}
	initAi() {
		const {ai} = this;
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
		ai.createAiSnake();
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
		const self = this;
		self.onRestart = function () {
			self.restart();
		}
		EventController.subscribe(GAME_RESTART, self.onRestart);
	}
	/**
	 * 重启游戏
	 */
	restart() {
		const { app, gameMap, controller } = this;
		app.ticker.remove(gameMap.update, gameMap);
		this.snakeManager.recover();
		this.foodsManager.recover();
		const mySnake = this.snakeManager.createSnake();
		mySnake.isMine = true;
		mySnake.container.name = 'mySnake';
		gameMap.setMySnake(mySnake);
		controller.setMySnake(mySnake);
		this.initAi();
		this.start();
	}
	/**
	 * 启动游戏
	 */
	start() {
		const { app, gameMap } = this;
		app.ticker.add(gameMap.update, gameMap);
	}

	//TODO:
	over() {
		EventController.publish(new Event(GAME_OVER));
	}
}
export default Game;