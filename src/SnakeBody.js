import { Sprite, Texture } from 'pixi.js';
import { crossProduct, isEqualVector, mode } from './Bound.js';
import Interpolation from './Interpolation';

class SnakeBody {
	/**
	 * 构造函数
	 * @param {SnakeBody} precursor //前驱,蛇头的前驱为null
	 * @param {Number} cate 蛇的颜色
	 * @param {String} type 蛇身还是蛇头 'head'|'body'
	 * @param {Object} bound 边界 {x, y}
	 */
	constructor(precursor, cate = 1, type = 'body', bound = {x: 0, y: 0}) {
		this.precursor = precursor;
		this.name = 'snakebody';
		this.sprite = null;
		this.cate = cate;
		this.type = type;
		this.bound = bound;
		this.direc = {x: 1, y: 0};
		this.direcInterp = new Interpolation({x: 1, y: 0}, 6);
		if (this.type === 'body') {
			this.pos = {
				x: precursor.sprite.position.x - precursor.sprite.width,
				y: precursor.sprite.position.y
			}
		}
		this.init();
	}
	init() {
		const { pos, type } = this;
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		if (type === 'body') {
			this.sprite.position.set(pos.x, pos.y);
		}
	}
	update() {
		this.updateDirec();
		if (this.type === 'body') {
			this.updatePos();
		}
	}
	//方向进行插值更新
	updateDirec() {
		const { direcInterp, direc, precursor, sprite } = this;
		const precursorDirec = precursor.direc;
		if (isEqualVector(direc, precursorDirec)) {
			return;
		}
		direcInterp.setNext(precursorDirec);
		//插值
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const cross = crossProduct({x: 1, y: 0}, direc);
		sprite.rotation = cross > 0 ? cosval : -1 * cosval;
	}
	//位置进行插值更新
	updatePos() {
		const { direc, sprite, precursor, pos } = this;
		const { position: precursorPos, width: width } = precursor.sprite;
		const { x: dx = 0, y: dy = 0 } = direc;
		pos.x = precursorPos.x - width * dx;
		pos.y = precursorPos.y - width * dy
		sprite.position.set(pos.x, pos.y);
	}
	//设置蛇头的插值方向
	setHeadDirec(direc) {
		this.direcInterp.setNext(direc);
	}
	//更新蛇头的插值方向
	updateHeadDirec() {
		const { direcInterp, direc, sprite } = this;
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const cross = crossProduct({x: 1, y: 0}, direc);
		sprite.rotation = cross.z > 0 ? cosval : -1 * cosval;
	}
	//更新蛇头的位置
	updateHeadPos(v) {
		const { direc, sprite, bound } = this;
		const pos = sprite.position;
		let {x, y} = pos;
		x += v * direc.x;
		y += v * direc.y;
		if (x + sprite.width / 2 >= bound.x) {
			pos.x = bound.x - sprite.width / 2;
			pos.y = y;
		} else if (x - sprite.width / 2 <= 0) {
			pos.x = sprite.width / 2;
			pos.y = y;
		} else if (y + sprite.height / 2 >= bound.y) {
			pos.x = x;
			pos.y = bound.y - sprite.height / 2;
		} else if (y - sprite.height / 2 <= 0) {
			pos.x = x;
			pos.y = sprite.height / 2;
		} else {
			pos.x = x;
			pos.y = y;
		}
	}
}

export default SnakeBody;