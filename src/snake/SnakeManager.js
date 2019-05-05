import { Point, Container } from 'pixi.js';
import { HORIZONTAL_DIVISION_NUM, VERTICAL__DIVISION_NUM, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT, UPDATE_MY_SNAKE } from '../utils/constants';

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
		this.mySnake = null;
		this.container = new Container();
	}
	init() {
		const { division, container } = this;
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
		// 初始化容器
		container.position.set(0, 0);
		container.name = 'SnakeManager';
	}
	/**
	 * 添加蛇
	 * @param {Snake} snake
	 */
	addSnake(snake) {
		const { snakes, container } = this;
		const pos = this.getRandomPos();
		const direc = this.randomDirec();
		snake.init(snakes.length, pos, direc);
		snakes.push(snake);
		container.addChild(snake.container);
	}
	/**
	 * 删除蛇
	 * @param {Snake} snake 
	 */
	removeSnake(snake) {
	}
	/**
	 * 更新每条蛇的位置
	 */
	update() {
		const { snakes } = this;
		for (let i = 0, l = snakes.length; i < l; i++) {
			snakes[i].update();
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
	/**
	 * 设置玩家的蛇
	 * @param {Snake} snake 玩家自己的蛇
	 */
	setMySnake(snake) {
		this.mySnake = snake;
		this.addSnake(snake);
	}
	createSnake() {
		
	}
}
export default SnakeManager;