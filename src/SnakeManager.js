import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM } from './constants';

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
		const { division, snakes } = this;
		snakes.push(snake);
	}
	removeSnake() {

	}
}
export default SnakeManager;