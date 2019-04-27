import { Sprite, Texture } from 'pixi.js';
import { crossProduct, isEqualVector, mode, Sphere } from './Bound';
import Interpolation from './Interpolation';
import EventController from './EventController';
import Event from './Event';
import { UPDATE_MAP, UPDATE_FOODS } from './constants';

class SnakeBody {
	/**
	 * 构造函数
	 * @param {SnakeBody} precursor //前驱,蛇头的前驱为null
	 * @param {Number} cate 蛇的颜色
	 * @param {String} type 蛇身还是蛇头 'head'|'body'
	 * @param {Object} bound 边界 {x, y}
	 * @param {Number} screenWidth 屏幕宽
	 * @param {Number} screenHeight 屏幕高
	 */
	constructor(precursor, cate = 1, type = 'body', headInitialPos, bound = {left: 0, right: 0, top: 0, bottom: 0}, screenWidth = 0, screenHeight = 0) {
		this.precursor = precursor;
		this.name = 'SnakeBody';
		this.sprite = null;
		this.cate = cate;
		this.type = type;
		this.bound = bound; //边界
		this.direc = {x: 1, y: 0};
		this.direcInterp = new Interpolation({x: 1, y: 0}, 6);
		//全局位置
		if (type === 'head') {
			this.pos = headInitialPos;
			//相对于窗口的位置
			this.screenPos = {
				x: screenWidth / 2,
				y: screenHeight / 2
			};
		}
		this.init();
	}
	init() {
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		const { type, precursor, sprite } = this;
		if (type === 'body') {
			const x = precursor.sprite.position.x - sprite.width * precursor.direc.x;
			const y = precursor.sprite.position.y - sprite.width * precursor.direc.y;
			this.direc.x = precursor.direc.x;
			this.direc.y = precursor.direc.y;
			this.sprite.position.set(x, y);
		}
		// 蛇身体的包围圆
		this.boundingSphere = new Sphere(0, 0, sprite.width);
	}
	update() {
		this.updateDirec();
		if (this.type === 'body') {
			this.updatePos();
		}
	}
	/**
	 * 方向进行插值更新
	 */
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
	/**
	 * 位置进行插值更新
	 */
	updatePos() {
		const { direc, sprite, precursor } = this;
		const { position: precursorPos, width: width } = precursor.sprite;
		const { x: dx = 0, y: dy = 0 } = direc;
		const x = precursorPos.x - width * dx;
		const y = precursorPos.y - width * dy;
		sprite.position.set(x, y);
	}
	/**
	 * 设置蛇头的插值方向
	 * @param {Object} direc {x, y}
	 */
	setHeadDirec(direc) {
		if (this.type !== 'head') {
			return;
		}
		this.direcInterp.setNext(direc);
	}
	/**
	 * 更新蛇头的插值方向
	 */
	updateHeadDirec() {
		if (this.type !== 'head') {
			return;
		}
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
		if (this.type !== 'head') {
			return;
		}
		const { sprite, direc, screenPos, pos } = this;
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
		x = 400;
		y = 200;
		if (pos.x - 400 <= left) {
			x = 400 + pos.x - (left + 400);
		} else if (pos.x + 400 >= right) {
			x = 400 +  pos.x - (right - 400);
		}
		if (pos.y - 200 <= top) {
			y = 200 + pos.y - (top + 200);
		} else if (pos.y + 200 >= bottom) {
			y = 200 + pos.y - (bottom - 200);
		}
		screenPos.x = x;
		screenPos.y = y;
		sprite.position.set(screenPos.x, screenPos.y);
		//通知地图更新位置
		EventController.publish(new Event(UPDATE_MAP, pos.x, pos.y));
		EventController.publish(new Event(UPDATE_FOODS, pos.x, pos.y));
	}
}

export default SnakeBody;