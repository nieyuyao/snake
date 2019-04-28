import { Sprite, Texture } from 'pixi.js';
import { crossProduct, isEqualVector, mode, Sphere } from '../Bound';
import Interpolation from '../Interpolation';

class SnakeBody {
	/**
	 * 构造函数
	 * @param {SnakeBody} precursor //前驱,蛇头的前驱为null
	 * @param {Number} cate 蛇的颜色
	 * @param {String} type 蛇身还是蛇头 'head'|'body'
	 * @param {Object} bound 边界 {x, y}
	 */
	constructor(precursor, cate = 1, type = 'body', bound = {left: 0, right: 0, top: 0, bottom: 0}) {
		this.precursor = precursor;
		this.name = 'SnakeBody';
		this.sprite = null;
		this.cate = cate;
		this.type = type;
		this.bound = bound; //边界
		this.direc = {x: 1, y: 0};
		this.direcInterp = new Interpolation({x: 1, y: 0}, 6);
		this.init();
	}
	init() {
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		const { precursor, sprite } = this;
		const x = precursor.sprite.position.x - sprite.width * precursor.direc.x;
		const y = precursor.sprite.position.y - sprite.width * precursor.direc.y;
		this.direc.x = precursor.direc.x;
		this.direc.y = precursor.direc.y;
		this.sprite.position.set(x, y);
		// 蛇身体的包围圆
		this.boundingSphere = new Sphere(0, 0, sprite.width);
	}
	update() {
		this.updateDirec();
		this.updateBodyPos();
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
	updateBodyPos() {
		const { direc, sprite, precursor } = this;
		const { position: precursorPos, width: width } = precursor.sprite;
		const { x: dx = 0, y: dy = 0 } = direc;
		const x = precursorPos.x - width * dx;
		const y = precursorPos.y - width * dy;
		sprite.position.set(x, y);
	}
}

export default SnakeBody;