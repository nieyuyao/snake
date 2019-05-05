/**
 * 向量点乘
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
export const dotProduct = function (v1, v2) {
	if (!v1.z) {
		v1.z = 0;
	}
	if (!v2.z) {
		v2.z = 0;
	}
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
/**
 * 向量叉乘
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
export const crossProduct = function (v1, v2) {
	return {
		x: 0,
		y: 0,
		z: v1.x * v2.y - v1.y * v2.x
	}
};
/**
 * 两个向量是否相等
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
export const isEqualVector = function (v1, v2) {
	return v1.x === v2.x && v1.y === v2.y;
}
/**
 * 向量的模
 * @param {Vector} v
 */
export const mode = function (v) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}
export const squareDistance = function (p1, p2) {
	return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
}
export const reflectVector = function (v1, v2) {
	const cos = dotProduct(v1, v2);
	// const l = 1;
	const l = Math.sqrt((2 * cos * v1.x - v2.x) * (2 * cos * v1.x - v2.x) + (2 * cos * v1.y - v2.y) * (2 * cos * v1.y - v2.y));
	let x = (2 * cos * v1.x - v2.x) / l;
	let y = (2 * cos * v1.y - v2.y) / l;
	return {
		x: x + (cos < 0.001 && cos > -0.001 ? 0.1 * v1.x : 0),
		y: y + (cos < 0.001 && cos > -0.001 ? 0.1 * v1.y : 0)
	}
}
/**
 * 包围圆
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} r  
 */   
export const Sphere = function (x = 0, y = 0, r = 0) {
	this.x = x;
	this.y = y;
	this.r = r;

	this.surroundPoint = function (p) {
		const {
			x: px = 0,
			y: py = 0
		} = p;
		const {
			x,
			y
		} = this;
		return (px - x) * (px - x) + (py - y) * (py - y) <= this.r * this.r;
	}
}
/**
 * 包围矩形
 * @param {Point} p1 
 * @param {Point} p2 
 * @param {Point} p3 
 * @param {Point} p4 
 */
export const Rectangle = function (p1 = {
	x: 0,
	y: 0
}, p2 = {
	x: 0,
	y: 0
}, p3 = {
	x: 0,
	y: 0
}, p4 = {
	x: 0,
	y: 0
}) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.edges = [];
	this.isRectangle();
	//检查4个点是否构成矩形
	const isRect = function (p1, p2, p3, p4) {
		const v1 = {
			x: p1.x - p2.x,
			y: p1.y - p2.y
		};
		const v2 = {
			x: p3.x - p2.x,
			y: p3.y - p2.y
		};
		if (dotProduct(v1, v2) <= 0.1) {
			const v3 = {
				x: p1.x - p4.x,
				y: p1.y - p4.y
			};
			const v4 = {
				x: p2.x - p4.x,
				y: p2.y - p4.y
			}
			if (dotProduct(v3, v4) <= 0.1 && mode(v3) - mode(v2) <= 0.1) {
				return true;
			}
		}
		return false;
	}
	this.isRectangle = function () {
		let result = false;
		if (isRect(this.p1, this.p2, this.p3, this.p4)) {
			result = true;
		}
		if (isRect(this.p1, this.p3, this.p2, this.p4)) {
			//交换p2与p3
			const p = this.p2;
			this.p2 = this.p3;
			this.p3 = p;
			result = true;
		}
		if (result) {
			this.edges.push(
				[
					{x: p2.x - p1.x, y: p2.y - p1.y},
					{x: p3.x - p4.x, y: p3.y - p4.y}
				]
			);
			this.edges.push(
				[
					{x: p2.x - p3.x, y: p2.y - p3.y},
					{x: p1.x - p4.x, y: p1.y - p4.y}
				]
			);
		}
		return result;
	}
	this.surroundPoint = function (p) {
		const v1 = {x: p.x - p1.x, y: p.y - p1.y};
		const v2 = {x: p.x - p4.x, y: p.y - p4.y};
		const v3 = {x: p.x - p4.x, y: p.y - p4.y};
		const v4 = {x: p.x - p3.x, y: p.x - p3.y};
		if (
			dotProduct(crossProduct(v1, this.edges[0][0]), crossProduct(v2, this.edges[0][1])) < 0 &&
			dotProduct(crossProduct(v3, this.edges[1][0]), crossProduct(v4, this.edges[1][1])) < 0
		) {
			return true;
		}
		return false;
	}
}