import SnakeBody from './SnakeBody.js';
import { Container } from 'pixi.js';
import EventController from './EventController.js';
import Collision from './Collision.js';

class Snake {
	constructor(app) {
		this.name = 'snake';
		this.head = null;
		this.bodies = [];
		this.cate = 1; //类别
		this.app = app;
		this.container = new Container();
		this.bodyContainer = new Container();
		this.v = 2; //初始速度
		this.VEC_MAX = 4;
		this.VEC_MIN = 2;
		this.a = 0.1;
		this._score = 0;
	}
	get score() {
		return this._score;
	}
	set score(val) {
		if (val % 5 === 0) {
			this.addBody();
		}
		this._score = val;
	}
	init() {
		const { app, bodies, update, cate, bodyContainer, container } = this;
		//边界
		const bound = {
			left: app.screen.width / 2 - 3000 / 2,
			right: app.screen.width / 2 + 3000 / 2,
			top: app.screen.height / 2 - 1500 / 2,
			bottom: app.screen.height / 2 + 1500 / 2
		};
		this.bound = bound;
		//蛇头
		this.head = new SnakeBody(null, cate, 'head', bound);
		const head = this.head;
		head.sprite.position.set(app.screen.width / 2, app.screen.height / 2);
		//蛇身
		const body1 = new SnakeBody(this.head, cate, 'body', bound);
		const body2 = new SnakeBody(body1, cate, 'body', bound);
		const body3 = new SnakeBody(body2, cate, 'body', bound);
		const body4 = new SnakeBody(body3, cate, 'body', bound);
		
		bodies.push(body1);
		bodies.push(body2);
		bodies.push(body3);
		bodies.push(body4);

		for (let i = 0; i < 4; i++) {
			const body = bodies[i];
			bodyContainer.addChild(body.sprite);
		}
		const self = this;
		//订阅更新分数事件，如果吃到食物进行加分，并判断是否需要增加蛇的长度
		const eventAdapter = {
			eventHandler(ev) {
				if (ev.type === 'update-socre') {
					self.score += 1;
				}
			}
		}
		EventController.subscribe(eventAdapter);
		container.addChild(bodyContainer);
		container.addChild(this.head.sprite);
		app.ticker.add(update, this);
	}
	//转向
	turnAround(direc) {
		this.head.setHeadDirec(direc);
	}
	//吃掉食物之后，增加一个蛇的长度
	addBody() {
		const { cate, bodies, bound, bodyContainer } = this;
		const precursor = bodies[bodies.length - 1];
		const body = new SnakeBody(precursor, cate, 'body', bound);
		bodies.push(body);
		bodyContainer.addChild(body.sprite);
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
	/**
	 * 检查是否与其他蛇碰撞
	 * @param {Snake} snake
	 */
	collisite(snake) {
		Collisition.sphereCollisition();
	}
}

export default Snake;