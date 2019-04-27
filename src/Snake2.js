import Snake from './Snake';
import SnakeHead from './SnakeHead';

class SnakeHead2 extends SnakeHead {
	constructor(precursor, cate = 1, type, headInitialPos, bound = {left: 0, right: 0, top: 0, bottom: 0}) {
		super(precursor, cate, type, headInitialPos, bound);
		this.name = 'SnakeHead2';
	}
}
class Snake2 extends Snake {
	constructor() {
		super();
		this.name = 'Snake2';
	}
	init() {
		this.id = id;
		// 蛇头的初始位置转化为屏幕坐标
		this.headInitialPos = MAP_TO_SCREEN_MATRIX.applyInverse(headMapPos, new Point(0, 0));
		const { bodies, cate, bodyContainer, container, headInitialPos } = this;
		// 边界
		const bound = {
			left: SCREEN.width / 2 - _OFFSET_CANVAS_WIDTH / 2,
			right: SCREEN.width / 2 + _OFFSET_CANVAS_WIDTH / 2,
			top: SCREEN.height / 2 - _OFFSET_CANVAS_HEIGHT / 2,
			bottom: SCREEN.height / 2 + _OFFSET_CANVAS_HEIGHT / 2
		};
		this.bound = bound;
		// 蛇头
		this.head = new SnakeHead2(null, cate, 'head', headInitialPos, bound, SCREEN.width, SCREEN.height);
		const head = this.head;
		head.sprite.position.set(SCREEN.width / 2, SCREEN.height / 2);
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