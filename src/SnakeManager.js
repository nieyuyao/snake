import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM, SCREEN } from './constants';

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
		const headPos = this.provideRandomPos();
		snake.init(snakes.length, headPos);
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
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			snakes[i].update();
		}
	}
	// 分配一个随机位置
	provideRandomPos() {
		// 相对于屏幕的随机位置
		let x = Math.random() * SCREEN.width;
		let y = Math.random() * SCREEN.height;
		return {x, y};
	}
}
export default SnakeManager;