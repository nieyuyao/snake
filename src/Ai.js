class Ai {
	/**
	 * 构造函数
	 * @param {Snake} snake 需要控制的蛇
	 * @param {TIXI.Ticker} ticker
	 */
	constructor(ticker) {
		this.snakes = [];
		this.ticker = ticker;
		this.ticker.add(this.checkIsToCollide, this);
	}
	addSnake(snake) {
		this.snakes.push(snake);
	}
	/**
	 * 更新
	 */
	checkIsToCollide() {
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			const snake = snakes[i];
			// 检测蛇是否与其他蛇相撞
			for (let j = 0; j < l; j++) {
				if (snake.checkCollide(snakes[j])) {
					snake.emit();
				}
			}
		}
	}
}

export default Ai;