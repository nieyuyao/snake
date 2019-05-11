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
			if (Math.abs(this.value.x - this.next.x) < 0.0001) {
				this.value.x = this.next.x;
			} else {
				this.value.x = this.value.x + (this.next.x - this.value.x) / this.interval;
			}
			if (Math.abs(this.value.y - this.next.y) < 0.0001) {
				this.value.y = this.next.y;
			} else {
				this.value.y = this.value.y + (this.next.y - this.value.y) / this.interval;
			}
		}
		return this.value;
	}
	setNext(next) {
		this.next = next;
	}
	setValue(val) {
		this.value.x = val.x;
		this.value.y = val.y;
		this.next.x = val.x;
		this.next.y = val.y;
	}
}

export default Interpolation;