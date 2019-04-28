import { Sprite, Texture } from 'pixi.js';
import { crossProduct, Sphere } from '../Bound';
import SnakeBody from './SnakeBody';
import { SCREEN } from '../constants';

/**
 * screenPos {x, y} 屏幕坐标 左上角为坐标原点
 * viewPortPos {x, y} 视口坐标 以屏幕左上角为原点, 限制蛇头在视口区域
 */
class SnakeHead extends SnakeBody {
	constructor(precursor, cate = 1, type, intialScreenPos, bound = {left: 0, right: 0, top: 0, bottom: 0}) {
		super(precursor, cate, type, bound);
		this.name = 'SnakeHead';
		this.screenPos = intialScreenPos;
		this.viewPortPos = {
			x: SCREEN.width / 2,
			y: SCREEN.height / 2
		};
		this.init();
	}
	init() {
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		const { sprite } = this;
		// 蛇身体的包围圆
		this.boundingSphere = new Sphere(0, 0, sprite.width);
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
		const { direcInterp, direc, sprite, bound, screenPos } = this;
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const w = sprite.width / 2;
		const h = w;
		const { x, y } = screenPos;
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
		const { sprite, direc, viewPortPos, screenPos } = this;
		const { left, right, top, bottom } = this.bound;
		let x = screenPos.x + direc.x * v;
		let y = screenPos.y + direc.y * v;
		const w = sprite.width / 2;
		const h = sprite.height / 2;
		screenPos.x = x;
		screenPos.y = y;
		if (x - w <= left) {
			screenPos.x = left + w;
			screenPos.y = y;
		} else if (x + w >= right) {
			screenPos.x = right - w;
			screenPos.y = y;
		}
		if (y - h <= top) {
			screenPos.x = x;
			screenPos.y = top + h;
		} else if (y + h >= bottom) {
			screenPos.x = x;
			screenPos.y = bottom - h;
		}
		this.calRenderPos();
		sprite.position.set(viewPortPos.x, viewPortPos.y);
	}
	/**
	 * 计算渲染位置
	 */
	calRenderPos() {
		let w = SCREEN.width / 2;
		let h = SCREEN.height / 2;
		let x = SCREEN.width / 2;
		let y = SCREEN.height / 2;
		const {viewPortPos, screenPos } = this;
		const { left, right, top, bottom } = this.bound;
		if (screenPos.x - w <= left) {
			x = w + screenPos.x - (left + w);
		} else if (screenPos.x + w >= right) {
			x = w +  screenPos.x - (right - w);
		}
		if (screenPos.y - h <= top) {
			y = h + screenPos.y - (top + h);
		} else if (screenPos.y + h >= bottom) {
			y = h + screenPos.y - (bottom - h);
		}
		viewPortPos.x = x;
		viewPortPos.y = y;
	}
}

export default SnakeHead;