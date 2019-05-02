
class Ai {
	/**
	 * 构造函数
	 * @param {App} app
	 * @param {SnakeManager} sm
	 */
	constructor(sm) {
		this.snakes = [];
		this.sm = sm;
	}
	addSnake(snake) {
		this.snakes.push(snake);
		// 加入sm中，会给蛇随机分配一个位置
		this.sm.addSnake(snake);
	}
	update() {
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			const snake = snakes[i];
		}
	}
}

export default Ai;