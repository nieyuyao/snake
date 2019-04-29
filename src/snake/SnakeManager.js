import { Point } from 'pixi.js';
import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, UPDATE_MAP, UPDATE_FOODS, SCREEN_TO_MAP_MATRIX } from '../constants';
import EventController from '../event/EventController';
import Event from '../event/Event';

/**
 * 管理游戏中的蛇
 * 1. 添加蛇
 * 2. 删除蛇
 */
class SnakeManager {
	constructor(app) {
		this.name = 'SnakeManager';
		this.app = app;
		this.division = {};
		this.snakes = [];
		this.init();
		this.mySnake = null;
	}
	init() {
		const { division, app } = this;
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
		app.ticker.add(this.update, this);
	}
	/**
	 * 添加蛇
	 * @param {Snake} snake
	 */
	addSnake(snake) {
		const { snakes, app } = this;
		const screenPos = this.provideRandomPos();
		snake.init(snakes.length, screenPos);
		snakes.push(snake);
		app.stage.addChild(snake.container);
	}
	/**
	 * 删除蛇
	 * @param {Snake} snake 
	 */
	removeSnake(snake) {
	}
	/**
	 * 更新每条蛇的位置
	 */
	update() {
		if (this.mySnake) {
			this.mySnake.update();
			const pos = this.mySnake.head.screenPos; // 屏幕坐标
			EventController.publish(new Event(UPDATE_MAP, pos.x, pos.y));
			EventController.publish(new Event(UPDATE_FOODS, pos.x, pos.y));
		}
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			snakes[i].update();
		}
	}
	/**
	 * 分配一个随机位置(绝对坐标, 地图坐标)
	 */
	provideRandomPos() {
		// 随机的屏幕坐标
		let x = Math.random() * _OFFSET_CANVAS_WIDTH;
		let y = Math.random() * _OFFSET_CANVAS_HEIGHT;
		const p1 = new Point(x, y);
		return SCREEN_TO_MAP_MATRIX.applyInverse(p1);
	}
	/**
	 * 设置玩家的蛇
	 * @param {Snake} snake 玩家自己的蛇
	 */
	setMySnake(snake) {
		this.mySnake = snake;
		const screenPos = this.provideRandomPos();
		this.mySnake.init(-1, screenPos);
		this.app.stage.addChild(snake.container);
	}
}
export default SnakeManager;