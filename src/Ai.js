class Ai {
	/**
	 * 构造函数
	 * @param {Snake} snake 需要控制的蛇
	 * @param {TIXI.Ticker} ticker
	 */
	constructor(snake, ticker) {
		this.snake = snake;
		this.ticker = ticker;
		this.ticker.add(this.checkIsToCollide, this);
	}
	/**
	 * 更新
	 */
	checkIsToCollide() {
		
	}
}

export default Ai;