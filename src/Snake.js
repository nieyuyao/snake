import SnakeBody from './SnakeBody.js';
import { Container } from 'pixi.js';

class Snake {
	constructor(app) {
		this.name = 'snake';
		this.head = null;
		this.bodies = [];
		this.cate = 1; //类别
		this.app = app;
		this.container = new Container();
		this.v = 2; //初始速度
		this.VEC_MAX = 4;
		this.VEC_MIN = 2;
		this.a = 0.1;
	}
	init() {
		const { app, bodies, update } = this;
		//边界
		let bound = {
			left: app.screen.width / 2 - 3000 / 2,
			right: app.screen.width / 2 + 3000 / 2,
			top: app.screen.height / 2 - 1500 / 2,
			bottom: app.screen.height / 2 + 1500 / 2
		};
		//蛇头
		this.head = new SnakeBody(null, this.cate, 'head', bound);
		const { container, head } = this;
		head.sprite.position.set(app.screen.width / 2, app.screen.height / 2);
		//蛇身
		const body1 = new SnakeBody(this.head, this.cate, 'body', bound);
		const body2 = new SnakeBody(body1, this.cate, 'body', bound);
		const body3 = new SnakeBody(body2, this.cate, 'body', bound);
		const body4 = new SnakeBody(body3, this.cate, 'body', bound);
		const body5 = new SnakeBody(body4, this.cate, 'body', bound);
		const body6 = new SnakeBody(body5, this.cate, 'body', bound);
		const body7 = new SnakeBody(body6, this.cate, 'body', bound);
		const body8 = new SnakeBody(body7, this.cate, 'body', bound);
		const body9 = new SnakeBody(body8, this.cate, 'body', bound);
		const body10 = new SnakeBody(body9, this.cate, 'body', bound);
		const body11 = new SnakeBody(body10, this.cate, 'body', bound);
		const body12 = new SnakeBody(body11, this.cate, 'body', bound);
		const body13 = new SnakeBody(body12, this.cate, 'body', bound);
		const body14 = new SnakeBody(body13, this.cate, 'body', bound);
		const body15 = new SnakeBody(body14, this.cate, 'body', bound);
		const body16 = new SnakeBody(body15, this.cate, 'body', bound);
		const body17 = new SnakeBody(body16, this.cate, 'body', bound);
		const body18 = new SnakeBody(body17, this.cate, 'body', bound);
		bodies.push(body1);
		bodies.push(body2);
		bodies.push(body3);
		bodies.push(body4);
		bodies.push(body5);
		bodies.push(body6);
		bodies.push(body7);
		bodies.push(body8);
		bodies.push(body9);
		bodies.push(body10);
		bodies.push(body11);
		bodies.push(body12);
		bodies.push(body13);
		bodies.push(body14);
		bodies.push(body15);
		bodies.push(body16);
		bodies.push(body17);
		bodies.push(body18);

		for (let i = 17; i >= 0; i--) {
			const body = bodies[i];
			container.addChild(body.sprite);
		}
		container.addChild(this.head.sprite);
		app.ticker.add(update, this);
	}
	//转向
	turnAround(direc) {
		this.head.setHeadDirec(direc);
	}
	//吃掉食物之后，增加一个蛇身体
	addBody() {
	}
	//每帧更新
	update() {
		this.head.updateHeadDirec();
		this.head.updateHeadPos(this.v);
		for (let i = 0; i < this.bodies.length; i++) {
			this.bodies[i].update();
		}
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
		}
	}
}

export default Snake;