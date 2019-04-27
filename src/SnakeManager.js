import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM } from './constants';

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
		const { division } = this;
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
	}
	/**
	 * 添加蛇
	 * @param {Snake} snake
	 */
	addSnake(snake) {
		const { snakes } = this;
		snakes.push(snake);
	}
	/**
	 * 删除蛇
	 * @param {Snake} snake 
	 */
	removeSnake(snake) {

	}
}
export default new SnakeManager();