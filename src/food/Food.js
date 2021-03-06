import { Sprite, Texture } from 'pixi.js';
import Interpolation from '../utils/Interpolation';
import { Sphere } from '../utils/Bound';
import { FOOD_CHECK_SPHERE_RADIUS, TEXTURES } from '../utils/constants';

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
		this.interp = new Interpolation({x: x, y: y}, 6);
		this.eaten = false;
		const frame = 'bean' + type + '.png';
		let texture;
		if (TEXTURES[frame]) {
			texture = TEXTURES[frame];
		} else {
			texture = Texture.fromFrame(frame);
			TEXTURES[frame] = texture;
		}
		this.sprite = new Sprite(texture);
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.name = 'food';
		this.sprite.position.set(x, y);
		this.boundingSphere = new Sphere(x, y, FOOD_CHECK_SPHERE_RADIUS);
	}
	/**
	 * 移动食物
	 * @param {Object} targetPos 目标位置
	 */
	moveToSnake(targetPos) {
		this.eaten = true;
		this.interp.setNext(targetPos);
	}
	/**
	 * 更新食物位置
	 */
	update() {
		if (!this.eaten) {
			return;
		}
		const val = this.interp.lerp();
		const dx = this.x - val.x;
		const dy = this.y - val.y;
		if (dx * dx + dy * dy < 1) {
			this.visible = false;
			this.sprite.visible = false;
			return;
		}
		this.x = val.x;
		this.y = val.y;
		this.sprite.position.set(this.x, this.y);
	}
	/**
	 * 销毁食物
	 */
	destory() {
		this.sprite.destroy();
	}
}
export default Food;