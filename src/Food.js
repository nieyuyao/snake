import { Sprite, Texture } from 'pixi.js';
const tile = {
	1: {
		"x": 0,
		"y": 0,
		"w": 5,
		"h": 5
	},
	2: {
		"x": 0,
		"y": 7,
		"w": 5,
		"h": 5
	},
	3: {
		"x": 0,
		"y": 14,
		"w": 5,
		"h": 5
	},
	4: {
		"x": 0,
		"y": 21,
		"w": 5,
		"h": 5
	},
	5: {
		"x": 0,
		"y": 28,
		"w": 5,
		"h": 5
	},
	6: {
		"x": 0,
		"y": 35,
		"w": 5,
		"h": 5
	}
}

class Food {
	/**
	 * @param {Number} x 食物的x坐标
	 * @param {Nunber} y 食物的y坐标
	 * @param {Number} type 食物的类别
	 * @param {Number} order 食物的顺序号
	 */
	constructor(x = 0, y = 0, type = 1, order = 0) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.order = order;
		this.visible = true;
		this.imgX = tile[type].x;
		this.imgY = tile[type].y;
		this.w = tile[type].w;
		this.h = tile[type].h;
	}
	/**
	 * 移动食物
	 * @param {Object} targetPos 目标位置
	 */
	moveToSnake(targetPos) {
	}
}
export default Food;