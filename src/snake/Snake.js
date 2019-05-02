import { Container } from 'pixi.js';
import SnakeBody from './SnakeBody';
import SnakeHead from './SnakeHead';
import EventController from '../event/EventController';
import Event from '../event/Event';
import Collision from '../utils/Collision';
import { _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, INITIAL_SNAKE_BODY_NUM, COLLISION, SCREEN } from '../utils/constants';

/**
 * 玩家自己的蛇
 */
class Snake {
	/**
	 * @param {Object} headInitialPos 蛇头的初始位置
	 * @param {Number} id
	 */
	constructor() {
		this.name = 'Snake';
		this.head = null;
		this.bodies = [];
		this.cate = 1; // 类别
		this.container = new Container();
		this.bodyContainer = new Container();
		this.v = 2; // 初始速度
		this.VEC_MAX = 4;
		this.VEC_MIN = 2;
		this.a = 0.1;
	}
	/**
	 * 初始化
	 * @param {Number} id
	 * @param {Point} startPos 开始位置
	 */
	init(id, startPos) {
		this.id = id;
		const { bodies, cate, bodyContainer, container } = this;
		// 边界
		const bound = {
			left: 0,
			right: _OFFSET_CANVAS_WIDTH,
			top: 0,
			bottom: _OFFSET_CANVAS_HEIGHT
		};
		this.bound = bound;
		// 蛇头
		this.head = new SnakeHead(null, cate, 'head', startPos, bound, SCREEN.width, SCREEN.height);
		// 蛇身
		const body1 = new SnakeBody(this.head, cate, 'body', bound);
		const body2 = new SnakeBody(body1, cate, 'body', bound);
		const body3 = new SnakeBody(body2, cate, 'body', bound);
		const body4 = new SnakeBody(body3, cate, 'body', bound);
		bodies.push(body1);
		bodies.push(body2);
		bodies.push(body3);
		bodies.push(body4);
		for (let i = 0; i < INITIAL_SNAKE_BODY_NUM; i++) {
			const body = bodies[i];
			bodyContainer.addChild(body.sprite);
		}
		container.addChild(bodyContainer);
		container.addChild(this.head.sprite);
		container.name = 'snake';
		const self = this;
		// 订阅更新分数事件，如果吃到食物进行加分，并判断是否需要增加蛇的长度
		const eventAdapter = {
			eventHandler(ev) {
				// if (ev.type === UPDATE_SCORE) {
				// 	self.score += 1;
				// }
			}
		}
		EventController.subscribe(eventAdapter);
	}
	// 转向
	turnAround(direc) {
		this.head.setHeadDirec(direc);
	}
	// 吃掉食物之后，增加一个蛇的长度
	addBody() {
		const { cate, bodies, bound, bodyContainer } = this;
		const precursor = bodies[bodies.length - 1];
		const body = new SnakeBody(precursor, cate, 'body', bound);
		bodies.push(body);
		bodyContainer.addChild(body.sprite);
	}
	// 每帧更新
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
	getHeadBoundingSphere() {
		return this.head.boundingSphere;
	}
	/**
	 * 检查是否与其他蛇碰撞
	 * @param {Snake} snake
	 */
	checkCollide(snake) {
		const headBound = this.getHeadBoundingSphere();
		for (let i = 0, l = snake.bodies.length; i < l; i++) {
			if (Collision.sphereCollisition(headBound, snake.bodies.boundingSphere)) {
				return true;
			}
		}
		return false;
	}
	// 是否快要碰撞
	isWillCollide() {	
	}
	// 发出事件
	emit() {
		EventController.publish(new Event(COLLISION));
	}
}

export default Snake;