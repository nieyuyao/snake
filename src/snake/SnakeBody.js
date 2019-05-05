import { Sprite, Texture } from 'pixi.js';
import { crossProduct, isEqualVector, Sphere } from '../utils/Bound';
import Interpolation from '../utils/Interpolation';

class SnakeBody {
	/**
	 * 构造函数
	 * @param {SnakeBody} precursor //前驱,蛇头的前驱为null
	 * @param {Number} cate 蛇的颜色
	 * @param {String} type 蛇身还是蛇头 'head'|'body'
	 */
	constructor(precursor, cate = 1, type = 'body') {
		this.precursor = precursor;
		this.name = 'SnakeBody';
		this.sprite = null;
		this.direc = {x: 1, y: 0};
		this.cate = cate;
		this.type = type;
		this.direcInterp = null;
		this.pos = {x: 0, y: 0};
		this.init();
	}
	init() {
		const frame = this.type + this.cate + '.png';
		this.sprite = new Sprite(Texture.fromFrame(frame));
		this.sprite.scale.set(0.4, 0.4);
		this.sprite.anchor.set(0.5, 0.5);
		const { precursor, sprite, direc, pos } = this;
		const x = precursor.sprite.position.x - (sprite.width - 6) * precursor.direc.x;
		const y = precursor.sprite.position.y - (sprite.width - 6) * precursor.direc.y;
		pos.x = x;
		pos.y = y;
		direc.x = precursor.direc.x;
		direc.y = precursor.direc.y;
		sprite.position.set(x, y);
		sprite.name = 'SnakeBody';
		this.direcInterp = new Interpolation(this.direc, 6);
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
		const { direc, sprite, precursor, pos } = this;
		const { position: precursorPos, width: width } = precursor.sprite;
		const { x: dx = 0, y: dy = 0 } = direc;
		const x = precursorPos.x - (width - 6) * dx;
		const y = precursorPos.y - (width - 6) * dy;
		sprite.position.set(x, y);
		pos.x = x;
		pos.y = y;
	}
}

export default SnakeBody;