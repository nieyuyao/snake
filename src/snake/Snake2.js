import Snake from './Snake';
import SnakeHead from './SnakeHead';
import { crossProduct } from '../Bound'
import { SCREEN, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, INITIAL_SNAKE_BODY_NUM, SCREEN_TO_VIEWPORT_MATRIX } from '../constants';
import SnakeBody from './SnakeBody';

/**
 * 非玩家自己的蛇
 */
class SnakeHead2 extends SnakeHead {
	constructor(precursor, cate = 1, type, headInitialPos, bound = {left: 0, right: 0, top: 0, bottom: 0}) {
		super(precursor, cate, type, headInitialPos, bound);
		this.name = 'SnakeHead2';
	}
	/**
	 * 更新蛇头的位置,覆盖父类的方法
	 * @param {Object} v 速度 {x, y}
	 */
	updateHeadDirec() {
		const { direcInterp, direc, sprite, bound, screenPos } = this;
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const w = sprite.width / 2;
		const h = w;
		const { x, y } = screenPos;
		if ((x - w <= bound.left && direc.x < 0) || (x + w >= bound.right && direc.x > 0)) {
			//到达左边缘or到达右边缘
			direc.x = -direc.x;
			direcInterp.setValue({
				x: direc.x,
				y: direc.y
			});
		} else if ((y - h <= bound.top && direc.y < 0) || (y + h >= bound.bottom && direc.y > 0)) {
			//到达上边缘or到达下边缘
			direc.y = -direc.y;
			direcInterp.setValue({
				x: direc.x,
				y: -direc.y
			});
		}
		const cross = crossProduct({x: 1, y: 0}, direc);
		sprite.rotation = cross.z > 0 ? cosval : -1 * cosval;
	}
	calViewPortPos() {
		const { screenPos, viewPortPos } = this;
		const p = SCREEN_TO_VIEWPORT_MATRIX.apply(screenPos);
		viewPortPos.x = p.x;
		viewPortPos.y = p.y;
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