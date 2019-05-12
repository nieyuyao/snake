import { Container } from 'pixi.js';
import SnakeBody from './SnakeBody';
import SnakeHead from './SnakeHead';
import EventController from '../event/EventController';
import Event from '../event/Event';
import Collision from '../utils/Collision';
import { _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, INITIAL_SNAKE_BODY_NUM, SNAKE_DIE_EVENT_NAME, SNAKE_VEC_MAX, SNAKE_VEC_MIN, SNAKE_A, SNAKE_VEC_0 } from '../utils/constants';

/**
 * 玩家自己的蛇
 */
class Snake {
	/**
	 * @param {SnakeManager} sm 蛇管理器
	 */
	constructor(sm) {
		this.name = 'Snake';
		this.head = null;
		this.bodies = [];
		this.cate = Math.floor((Math.random() * 5) + 1); // 类别
		this.container = new Container();
		this.bodyContainer = new Container();
		this.v = SNAKE_VEC_0; // 初始速度
		this.score = 0;
		this.died = false;
		this.sm = sm;
	}
	/**
	 * 初始化
	 * @param {Number} id
	 * @param {Point} startPos 开始位置
	 * @param {Point} startDirec 开始方向
	 */
	init(id, startPos, startDirec) {
		this.id = id;
		const { bodies, cate, bodyContainer, container } = this;
		// 蛇头
		this.head = new SnakeHead(null, cate, 'head', startPos, startDirec, this, this.sm);
		// 蛇身
		const body1 = new SnakeBody(this.head, cate, 'body');
		const body2 = new SnakeBody(body1, cate, 'body');
		const body3 = new SnakeBody(body2, cate, 'body');
		const body4 = new SnakeBody(body3, cate, 'body');
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
	}
	// 转向
	turnAround(direc) {
		this.head.setHeadDirec(direc);
	}
	// 吃掉食物之后，增加一个蛇的长度
	addBody() {
		const { cate, bodies, bodyContainer } = this;
		const precursor = bodies[bodies.length - 1];
		const body = new SnakeBody(precursor, cate, 'body');
		bodies.push(body);
		bodyContainer.addChild(body.sprite);
	}
	// 每帧更新
	update() {
		if (this.died) {
			//TODO:死亡动画
			this.disintegrate();
			return;
		}
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
			this.v += accOrSlowDown * SNAKE_A;
			if (this.v >= SNAKE_VEC_MAX) {
				cb.bind(context)(1);
			}
			if (this.v <= SNAKE_VEC_MIN) {
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
	// 取到蛇头的位置
	getPos() {
		return this.head.pos;
	}
	getAllBodyPos() {
		const bodiesPos = this.bodies.map(body => body.pos);
		return [this.head.pos, ...bodiesPos];
	}
	// 解体
	disintegrate() {
		EventController.publish(new Event(SNAKE_DIE_EVENT_NAME, this.id));
	}
	// 死亡
	die() {
		this.died = true;
	}
	destory() {
		this.head.destory();
		for (let i = 0; i < this.bodies.length; i++) {
			this.bodies[i].destory();
		}
	}
}

export default Snake;