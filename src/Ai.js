import AiSnake from './snake/AiSnake';

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
	createAiSnake() {
		const aiSnake = new AiSnake(this.sm);
		this.addSnake(aiSnake);
	}
}

export default Ai;