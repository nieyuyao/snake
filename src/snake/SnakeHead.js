import { Sprite, Texture } from 'pixi.js';
import SnakeBody from './SnakeBody';
import { crossProduct, Sphere } from '../utils/Bound';

class SnakeHead extends SnakeBody {
	constructor(precursor, cate = 1, type, startPos, bound = {left: 0, right: 0, top: 0, bottom: 0}, parent) {
		super(precursor, cate, type, bound);
		this.name = 'SnakeHead';
		this.pos = startPos;
		this.parent = parent;
		this.init();
	}
	init() {
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.name = 'SnakeHead';
		// 蛇身体的包围圆
		this.boundingSphere = new Sphere(0, 0, this.sprite.width);
	}
	/**
	 * 设置蛇头的插值方向
	 * @param {Object} direc {x, y}
	 */
	setHeadDirec(direc) {
		this.direcInterp.setNext(direc);
	}
	/**
	 * 更新蛇头的插值方向
	 */
	updateHeadDirec() {
		const { direcInterp, direc, sprite, bound, pos } = this;
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const w = sprite.width / 2;
		const h = w;
		const { x, y } = pos;
		if ((x - w <= bound.left && direc.x < 0) || (x + w >= bound.right && direc.x > 0)) {
			//到达左边缘
			direc.x = 0;
		} else if ((y - h <= bound.top && direc.y < 0) || (y + h >= bound.bottom && direc.y > 0)) {
			direc.y = 0;
		}
		const cross = crossProduct({x: 1, y: 0}, direc);
		sprite.rotation = cross.z > 0 ? cosval : -1 * cosval;
	}
	/**
	 * 更新蛇头的位置
	 * @param {Object} v 速度 {x, y}
	 */
	updateHeadPos(v) {
		const { sprite, direc, pos } = this;
		const { left, right, top, bottom } = this.bound;
		let x = pos.x + direc.x * v;
		let y = pos.y + direc.y * v;
		const w = sprite.width / 2;
		const h = sprite.height / 2;
		pos.x = x;
		pos.y = y;
		if (x - w <= left) {
			pos.x = left + w;
			pos.y = y;
		} else if (x + w >= right) {
			pos.x = right - w;
			pos.y = y;
		}
		if (y - h <= top) {
			pos.x = x;
			pos.y = top + h;
		} else if (y + h >= bottom) {
			pos.x = x;
			pos.y = bottom - h;
		}
		sprite.position.set(pos.x, pos.y);
	}
}

export default SnakeHead;