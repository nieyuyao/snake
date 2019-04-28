import Snake from './Snake';
import SnakeHead from './SnakeHead';
import { SCREEN, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, INITIAL_SNAKE_BODY_NUM } from '../constants';
import SnakeBody from './SnakeBody';

class SnakeHead2 extends SnakeHead {
	constructor(precursor, cate = 1, type, headInitialPos, bound = {left: 0, right: 0, top: 0, bottom: 0}) {
		super(precursor, cate, type, headInitialPos, bound);
		this.name = 'SnakeHead2';
	}
	/**
	 * 更新蛇头的位置
	 * 覆盖父类的方法
	 * @param {Object} v 速度 {x, y}
	 */
	updateHeadPos(v) {
		const { sprite, direc, screenPos } = this;
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
		sprite.position.set(screenPos.x, screenPos.y);
	}
}
class Snake2 extends Snake {
	constructor() {
		super();
		this.name = 'Snake2';
	}
	init(id, screenPos) {
		this.id = id;
		// 蛇头的初始位置转化为屏幕坐标
		const { bodies, cate, bodyContainer, container } = this;
		// 边界
		const bound = {
			left: SCREEN.width / 2 - _OFFSET_CANVAS_WIDTH / 2,
			right: SCREEN.width / 2 + _OFFSET_CANVAS_WIDTH / 2,
			top: SCREEN.height / 2 - _OFFSET_CANVAS_HEIGHT / 2,
			bottom: SCREEN.height / 2 + _OFFSET_CANVAS_HEIGHT / 2
		};
		this.bound = bound;
		// 蛇头
		this.head = new SnakeHead2(null, cate, 'head', screenPos, bound, SCREEN.width, SCREEN.height);
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
	}
}

export default Snake2;