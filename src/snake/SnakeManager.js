import { Point, Container } from 'pixi.js';
import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, SNAKE_DIE_EVENT_NAME, DIE_SNAKE_SCORE, GAME_OVER } from '../utils/constants';
import EventController from '../event/EventController';
import Event from '../event/Event';
import Snake from './Snake';

/**
 * 管理游戏中的蛇
 * 1. 添加蛇
 * 2. 删除蛇
 */
class SnakeManager {
	constructor() {
		this.name = 'SnakeManager';
		this.division = {};
		this.snakes = [];
		this.container = new Container();
		this.container.position.set(0, 0);
		this.container.name = 'SnakeManager';
	}
	init() {
		const { division } = this;
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
		// 初始化容器
		const self = this;
		this.eventHandle = function (ev) {
			self.removeSnake(ev.val);
		}
		EventController.subscribe(SNAKE_DIE_EVENT_NAME, this.eventHandle);
	}
	/**
	 * 添加蛇
	 * @param {Snake} snake
	 */
	addSnake(snake) {
		const { snakes, container } = this;
		const pos = this.getRandomPos();
		const direc = this.randomDirec();
		/* eslint-disable no-var, vars-on-top, block-scoped-var */
		for (var i = 0, l = snakes.length; i < l; i++) {
			if (!snakes[i]) {
				break;
			}
		}
		snake.init(i, pos, direc);
		/* eslint-enable */
		snakes.push(snake);
		container.addChild(snake.container);
	}
	/**
	 * 删除蛇
	 * @param {Number} id 
	 */
	removeSnake(id) {
		const snake = this.snakes[id];
		this.container.removeChild(snake.container);
		snake.destory();
		EventController.publish(new Event(DIE_SNAKE_SCORE, {
			score: snake.score,
			positions: snake.getAllBodyPos()
		}));
		delete this.snakes[id];
		if (snake.isMine) {
			EventController.publish(new Event(GAME_OVER))
		}
	}
	/**
	 * 更新每条蛇的位置
	 */
	update() {
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			if (snakes[i]) {
				snakes[i].update();
			}
		}
	}
	/**
	 * 分配一个随机位置(绝对坐标, 地图坐标)
	 */
	getRandomPos() {
		// 随机的屏幕坐标
		let x = Math.random() * _OFFSET_CANVAS_WIDTH;
		let y = Math.random() * _OFFSET_CANVAS_HEIGHT;
		return new Point(x, y);
	}
	/**
	 * 随机方向
	 */
	randomDirec() {
		const s = Math.random();
		const r = Math.random();
		const x = s * (s > 0.5 ? 1 : -1);
		const y = Math.sqrt(1 - x * x) * (r > 0.5 ? 1 : -1);
		return { x, y};
	}
	createSnake() {
		const snake = new Snake(this);
		this.addSnake(snake);
		return snake;
	}
	removeAllSnakes() {
		const {snakes, container} = this;
		snakes.forEach(snake => {
			if (snake) {
				container.removeChild(snake.container);
				snake.destory();
			}
		});
		this.snakes = [];
	}
	recover() {
		this.removeAllSnakes();
		this.division = {};
		EventController.remove(SNAKE_DIE_EVENT_NAME, this.eventHandle);
		this.init();
	}
	destroy() {
		this.removeAllSnakes();
		this.container.destroy();
		EventController.remove(this.eventHandle);
	}
}
export default SnakeManager;