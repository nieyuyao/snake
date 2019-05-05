import GameMap from './GameMap';
import Controller from './Controller';
import Event from './event/Event';
import EventController from './event/EventController';
import Snake from './snake/Snake';
import AiSnake from './snake/AiSnake';
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
		this.mySnake = new Snake();
		this.snakeManager = new SnakeManager();
		this.gameMap = new GameMap(this.app);
		this.controller = new Controller(this.app, this.gameMap, this.mySnake);
		this.ai = new Ai(this.snakeManager);
		// this.aiSnake = new AiSnake();
		this.foodsManager.init(this.snakeManager);
		this.snakeManager.init();
		this.snakeManager.setMySnake(this.mySnake);
		// 初始化地图
		this.gameMap.init(this.foodsManager, this.snakeManager, this.mySnake);
		// 初始化控制器
		this.controller.init();
		const {
			gameMap,
			controller,
			app,
			aiSnake,
			ai
		} = this;
		// ai.addSnake(aiSnake);
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
		window.ai = ai;
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
	start() {
		const { app, gameMap } = this;
		app.ticker.add(gameMap.update, gameMap);
	}
}
export default Game;