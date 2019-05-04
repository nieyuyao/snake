import {
	Point,
	Container
} from 'pixi.js';
import Food from './Food';
import {
	FOOD_NUM_MAX,
	FOOD_NUM_MIN,
	_OFFSET_CANVAS_WIDTH,
	_OFFSET_CANVAS_HEIGHT,
	HORIZONTAL_DIVISION_NUM,
	VERTICAL__DIVISION_NUM,
	DIVISION_WIDTH,
} from '../utils/constants';

class FoodsManager {
	constructor() {
		this.name = 'foodsmanager';
		this.foods = [];
		this.idleOrder = 0; //表示食物列表空闲的最小值，防止每次遍历食物列表都从0开始，降低时间复杂度
		this.bound = null; //裁剪区的边界
		this.timer = -1; //计时器
		this.delay = -1; //计时器间隔
		this.spriteImg = new Image();
		this.spriteImg.src = '../assets/images.png';
		this.sprite = null;
		this.mPoint = new Point();
		this.division = {};
		this.container = new Container();
	}
	/**
	 * @param {SnakeManager} sm 蛇管理器
	 */
	init(sm) {
		this.sm = sm;
		const {
			division,
			container
		} = this;
		// 设置container的宽高
		container.position.set(0, 0);
		container.name = 'FoodManager';
		// 将食物绘图区划分为30*15份100*100的区域
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
		// 创建食物
		for (let i = 0; i < FOOD_NUM_MIN; i++) {
			const food = this.createFood();
			container.addChild(food.sprite);
		}
		this.generateFood();
	}
	/**
	 * 创建食物
	 */
	createFood() {
		const {
			foods,
			division
		} = this;
		if (foods[this.idleOrder] && this.idleOrder < foods.length) {
			this.idleOrder++;
			return this.createFood();
		}
		const ix = Math.floor(Math.random() * HORIZONTAL_DIVISION_NUM);
		const iy = Math.floor(Math.random() * VERTICAL__DIVISION_NUM);
		const x = ix * DIVISION_WIDTH + 16 + 1 + Math.random() * (DIVISION_WIDTH - 2 * 16 - 2);
		const y = iy * DIVISION_WIDTH + 16 + 1 + Math.random() * (DIVISION_WIDTH - 2 * 16 - 2);
		const divisionKey = `_${ix}_${iy}`;
		const type = Math.ceil(Math.random() * 6);
		const food = new Food(x, y, type, this.idleOrder, divisionKey);
		this.foods[this.idleOrder] = food;
		division[divisionKey][this.idleOrder] = 1;
		return food;
	}
	/**
	 * 移除食物
	 * @param {Food} food 食物
	 */
	removeFood(food) {
		const order = food.order;
		const divisionKey = food.divisionKey;
		delete this.division[divisionKey];
		if (this.idleOrder > order) {
			this.idleOrder = order;
		}
		delete this.foods[order];
	}
	/**
	 * 自动生成食物
	 */
	generateFood() {
		const {
			foods
		} = this;
		let count = 10;
		const generate = () => {
			if (foods.length < FOOD_NUM_MIN) {
				count = FOOD_NUM_MIN - foods.length;
			}
			for (let i = 0; i < count; i++) {
				if (foods.length < FOOD_NUM_MAX) {
					this.createFood();
				}
			}
			this.delay = this.calcDelay(foods.length);
			setTimeout(generate, this.delay);
		}
		generate();
	}
	/**
	 * 计算自动生成食物的间隔时间
	 */
	calcDelay(foodsCount) {
		return (100000 - 4000) / (FOOD_NUM_MAX - FOOD_NUM_MIN) * foodsCount;
	}
	/**
	 * 吃掉食物
	 * @param {Food} food 食物
	 * @param {Point} p 食物需要移动到的位置
	 */
	eatFood(food, p) {
		food.moveToSnake(p);
	}
	/**
	 * 更新食物
	 * @param {Object} p 当前蛇头的位置{x, y}
	 */
	update() {
		this.checkFoodIsEaten();
		const { foods } = this;
		for (let i = 0, l = foods.length; i < l; i++) {
			if (foods[i]) {
				foods[i].update();
			}
		}
	}
	checkFoodIsEaten() {
		const { foods, division, sm } = this;
		const { snakes } = sm;
		for (let si = 0; si < snakes.length; si++) {
			const snake = snakes[si];
			const pos = snake.getPos();
			const ix = Math.floor(pos.x / DIVISION_WIDTH);
			const iy = Math.floor(pos.y / DIVISION_WIDTH);
			const key = `_${ix}_${iy}`; // 当前蛇所在的区域
			const foodOrders = Object.keys(division[key]);
			if (!foodOrders.length) {
				continue;
			}
			for (let foi = 0; foi < foodOrders.length; foi++) {
				const order = foodOrders[foi];
				const food = foods[order];
				//如果对应下标的食物不存在
				if (!food) {
					continue;
				}
				//如果食物并未已经处在被吃状态，并且处在蛇的觅食范围内，执行吃食物方法
				if (!food.eaten && food.boundingSphere.surroundPoint({
					x: pos.x,
					y: pos.y
				})) {
					this.eatFood(food, {
						x: pos.x,
						y: pos.y
					});
					snake.score++;
				}
				//如果食物被吃完，那么移除食物
				if (!food.visible) {
					this.removeFood(food);
					continue;
				}
			}
		}
	}
}
export default FoodsManager;