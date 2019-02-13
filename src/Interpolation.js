class Interpolation {
	/**
	 * @param {Object} initialVal 初始值
	 * @param {Number} interval 插值间隔
	 */
	constructor(initialVal, interval = 60) {
		this.value = initialVal;
		this.next = initialVal;
		this.interval = interval;
	}
	//线性插值
	lerp() {
		if (!this.value) {
			this.value = this.next;
		} else {
			this.value.x = this.value.x + (this.next.x - this.value.x) / this.interval;
			this.value.y = this.value.y + (this.next.y - this.value.y) / this.interval;
		}
		return this.value;
	}
	setNext(next) {
		this.next = next;
	}
}

export default Interpolation;