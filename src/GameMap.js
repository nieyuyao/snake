import {
	Texture,
	extras
} from 'pixi.js';
import EventController from './EventController.js';
import Event from './Event.js';

class GameMap {
	constructor(app) {
		this.name = 'gamemap';
		this.v = 2;
		this.a = 0.1;
		this.vec = {
			x: -2,
			y: 0
		};
		this.app = app;
		this.tilingSprite = null;
		this.VEC_MAX = 4;
		this.VEC_MIN = 2;
	}
	init() {
		const {
			app,
			move,
		} = this;
		const texture = new Texture.fromImage('../assets/tile_map.png');
		this.tilingSprite = new extras.TilingSprite(texture, 3000, 3000);
		this.tilingSprite.anchor.set(0.5, 0.5);
		this.tilingSprite.position.set(app.screen.width / 2, app.screen.height / 2);
		app.ticker.add(move, this);
	}
	/**
	 * 设置地图移动方向
	 * @param {Object} direc 速度的方向
	 */
	setVec(direc) {
		this.vec.x = this.v * direc.x;
		this.vec.y = this.v * direc.y;
	}
	/**
	 * 加速减速
	 * @param {Number} accOrSlowDown 1/加速 -1/加速
	 * @param {Function} cb 回调
	 * @param {Oject} context 回调函数上下文
	 */
	advance(accOrSlowDown, cb, context) {
		if (this.v >= this.VEC_MAX && accOrSlowDown === 1) {
			this.v = this.VEC_MAX;
			return;
		}
		else if (this.v <= this.VEC_MIN && accOrSlowDown === -1) {
			this.v = this.VEC_MIN;
			return;
		}
		else {
			const v = this.v;
			this.v += accOrSlowDown * this.a;
			if (this.v >= this.VEC_MAX) {
				cb.bind(context)(1);
			}
			if (this.v <= this.VEC_MIN) {
				cb.bind(context)(-1);
			}
			const {x: vx = 0, y: vy = 0} = this.vec;
			this.vec.x = this.v * vx / v;
			this.vec.y = this.v * vy / v;
		}
	}
	//更新地图位置
	move() {
		const {
			tilingSprite,
			app
		} = this;
		const {
			x: vx = 0,
			y: vy = 0
		} = this.vec;
		let x = tilingSprite.position.x;
		let y = tilingSprite.position.y;
		x += vx;
		y += vy;
		//判断地图是否已经超出边界
		if (
			(x + tilingSprite.width / 2 <= app.screen.width || x - tilingSprite.width / 2 >= 0) &&
			(y + tilingSprite.height / 2 <= app.screen.height || y - tilingSprite.height / 2 >= 0)
		) {
			EventController.publish(new Event('ahead-map-bound', this.v, 0));
			return;
		} else if ((x + tilingSprite.width / 2 <= app.screen.width || x - tilingSprite.width / 2 >= 0)) {
			tilingSprite.position.y = y;
		} else if (y + tilingSprite.height / 2 <= app.screen.height || y - tilingSprite.height / 2 >= 0) {
			tilingSprite.position.x = x;
		} else {
			tilingSprite.position.x = x;
			tilingSprite.position.y = y;
		}
	}
}
export default GameMap;