import Snake from './Snake';
import SnakeHead from './SnakeHead';
import SnakeBody from './SnakeBody';
import { crossProduct, squareDistance, reflectVector } from '../utils/Bound'
import { _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, INITIAL_SNAKE_BODY_NUM, SNAKE_COLLISON_RADIUS, SNAKE_BOUND } from '../utils/constants';

/**
 * 非玩家自己的蛇
 */
class AiSnakeHead extends SnakeHead {
	constructor(precursor, cate = 1, type, startPos, startDirec, parent, sm) {
		super(precursor, cate, type, startPos, startDirec);
		this.name = 'AiSnakeHead';
		this.sm = sm;
		this.parent = parent;
	}
	// 检测是否即将与其他蛇碰撞
	isWillCollision() {
		const { snakes } = this.sm;
		const thisSnake = this.parent;
		const thisSnakePos = this.parent.getPos();
		let will = false;
		for (let si = 0, sl = snakes.length; si < sl; si++) {
			const snake = snakes[si];
			if (snake === thisSnake) {
				continue;
			}
			const bodies = snake.bodies;
			for (let bi = 0, bl = bodies.length; bi < bl; bi++) {
				const body = bodies[bi];
				if (squareDistance(thisSnakePos, body.pos) <= SNAKE_COLLISON_RADIUS) {
					this.turnRound(body.direc);
					will = true;
					break;
				}
			}
			if (will) {
				break;
			}
		}
	}
	// 检测哪个方向食物更多
	getMoreFoodsDirection() {
	}
	/**
	 * 更新蛇头的位置,覆盖父类的方法
	 * @param {Object} v 速度 {x, y}
	 */
	updateHeadDirec() {
		const { direcInterp, direc, sprite, pos } = this;
		const lerpDirec = direcInterp.lerp();
		direc.x = lerpDirec.x;
		direc.y = lerpDirec.y;
		const cosval = Math.acos(direc.x);
		const w = sprite.width / 2;
		const h = w;
		const { x, y } = pos;
		this.isWillCollision();
		// 到达左边缘
		if (x - w <= SNAKE_BOUND.left) {
			this.turnRound({x: 0, y: 1});
		}
		// 到达右边缘
		if (x + w >= SNAKE_BOUND.right) {
			this.turnRound({x: 0, y: 1});
		}
		// 到达上边缘
		if (y - h <= SNAKE_BOUND.top) {
			this.turnRound({x: 1, y: 0});
		}
		// 到达下边缘
		if (y + h >= SNAKE_BOUND.bottom) {
			this.turnRound({x: 1, y: 0});
		}
		const cross = crossProduct({x: 1, y: 0}, direc);
		sprite.rotation = cross.z > 0 ? cosval : -1 * cosval;
	}
	// 掉头
	turnRound(mirror) {
		const { direc, direcInterp } = this;
		const newDirec = reflectVector(mirror, direc);
		direc.x = newDirec.x;
		direc.y = newDirec.y;
		direcInterp.setValue({
			x: direc.x,
			y: direc.y
		});
	}
}
class AiSnake extends Snake {
	constructor(sm) {
		super();
		this.name = 'AiSnake';
		this.sm = sm;
	}
	init(id, startPos, startDirec) {
		this.id = id;
		const { bodies, cate, bodyContainer, container, sm } = this;
		// 蛇头
		this.head = new AiSnakeHead(null, cate, 'head', startPos, startDirec, this, sm);
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
		container.name = 'AiSnake';
	}
}

export default AiSnake;