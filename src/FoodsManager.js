import Food from './Food.js';
import {
	Sprite,
	Texture,
	Point,
	Matrix
} from 'pixi.js';
import EventController from './EventController.js';
import Event from './Event.js';
import { Sphere } from './Bound.js';

class FoodsManager {
	constructor(app) {
		this.app = app;
		this.foods = [];
		this.FOOD_NUM_MAX = 1000;
		this.INITIAL_FOOD_NUM = 100;
		this.idleOrder = 0; //表示食物列表空闲的最小值，防止每次遍历食物列表都从0开始，降低时间复杂度
		this.bound = null;
		this.timer = -1;
		this.delay = -1;
		this.screenWidth = app.screen.width;
		this.screenHeight = app.screen.height;
		
		let _offsetCanvas = document.createElement('canvas'); //用来画食物的离屏canvas
		_offsetCanvas.width = 3000;
		_offsetCanvas.height = 1500;
		this._offsetCtx = _offsetCanvas.getContext('2d');

		let offsetCanvas = document.createElement('canvas'); // 用来裁剪_offsetCanvas的离屏canvas
		offsetCanvas.width = app.screen.width;
		offsetCanvas.height = app.screen.height;
		this.offsetCtx = offsetCanvas.getContext('2d');
		this.mapImage = new Image();
		this.mapImage.src = '../assets/images.png';
		this.sprite = null;
		this.matrix = new Matrix(1, 0, 0, 1, 1100, 550);
		this.boundingSphere = new Sphere(0, 0, 20);
		this.mPoint = new Point();
		this._mPoint = new Point();
	}
	init() {
		const {
			_offsetCtx,
			offsetCtx,
			screenWidth,
			screenHeight,
			matrix,
			mPoint,
			_mPoint
		} = this;
		this.bound = {
			left: screenWidth / 2 - 3000 / 2,
			right: screenWidth / 2 + 3000 / 2,
			top: screenHeight / 2 - 1500 / 2,
			bottom: screenHeight / 2 + 1500 / 2
		};
		for (let i = 0; i < this.INITIAL_FOOD_NUM; i++) {
			this.createFood();
		}
		const point = new Point(400, 200);
		// const mPoint = new Point();
		matrix.apply(point, mPoint);
		matrix.apply(point, _mPoint);
		this.drawFoods(_mPoint);
		offsetCtx.drawImage(_offsetCtx.canvas, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		const texture = new Texture.fromCanvas(offsetCtx.canvas);
		this.sprite = new Sprite(texture);
		const self = this;
		const eventAdapter = {
			eventHandler(ev) {
				if (ev.type !== 'update-foods') {
					return;
				}
				self.update(ev.point);
			}
		}
		EventController.subscribe(eventAdapter);
		this.generateFood();
	}
	/**
	 * 创建食物
	 */
	createFood() {
		const { foods, app } = this;
		if (foods[this.idleOrder] && this.idleOrder < foods.length) {
			this.idleOrder++;
			this.createFood();
			return;
		}
		const x = Math.random() * 3000;
		const y = Math.random() * 1500;
		const type = Math.ceil(Math.random() * 6);
		const food = new Food(x, y, type, this.idleOrder, app.ticker);
		this.foods[this.idleOrder] = food;
	}
	/**
	 * 移除食物
	 * @param {Food} food 食物
	 */
	removeFood(food) {
		const order = food.order;
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
			foods,
			FOOD_NUM_MAX,
			INITIAL_FOOD_NUM
		} = this;
		let count = 10;
		const generate = () => {
			if (foods.length < INITIAL_FOOD_NUM) {
				count = INITIAL_FOOD_NUM - foods.length;
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
		return (100000 - 4000) / (this.FOOD_NUM_MAX - this.INITIAL_FOOD_NUM) * foodsCount;
	}
	/**
	 * 画出食物
	 * @param {Point} p 蛇头相对于_offsetCanvas的位置 {x, y}
	 */
	drawFoods(p) {
		//TODO:待优化，可以将屏幕划分为30*15份100*100的区域
		const { _offsetCtx, foods, mapImage, boundingSphere } = this;
		boundingSphere.x = p.x;
		boundingSphere.y = p.y;
		_offsetCtx.clearRect(0, 0, 3000, 1500);
		for (let i = 0; i < foods.length; i++) {
			const food = foods[i];
			//如果对应下标的食物不存在
			if (!food) {
				continue;
			}
			//如果食物并未已经处在被吃状态，并且处在蛇的觅食范围内，执行吃食物方法
			if (!food.eaten && boundingSphere.surroundPoint({x: food.x, y: food.y})) {
				this.eatFood(food, p);
			}
			//如果食物被吃完，那么移除食物
			if (!food.visible) {
				this.removeFood(food);
				continue;
			}
			_offsetCtx.drawImage(mapImage, food.imgX, food.imgY, food.w, food.h, food.x, food.y, food.w, food.h);
		}
	}
	/**
	 * 吃掉食物
	 * @param {Food} food 食物
	 * @param {Point} p 蛇头相对于_offsetCanvas的位置 {x, y}
	 */
	eatFood(food, p) {
		food.moveToSnake(p);
		EventController.publish(new Event('update-socre'));
	}
	/**
	 * 更新食物
	 * @param {Object} p 当前蛇头的位置{x, y}
	 */
	update(p) {
		let { x, y } = p;
		const {
			_offsetCtx,
			offsetCtx,
			matrix,
			sprite,
			screenWidth,
			screenHeight,
			mPoint,
			_mPoint
		} = this;
		const { left, right, top, bottom } = this.bound;
		//判断地图是否已经超出边界
		if (x + screenWidth / 2 >= right) {
			x = right - screenWidth / 2;
		}
		if (x - screenWidth / 2 <= left) {
			x = left + screenWidth / 2;
		}
		if (y + screenHeight / 2 >= bottom) {
			y = bottom - screenHeight / 2;
		}
		if (y - screenHeight / 2 <= top) {
			y = top + screenHeight / 2;
		}
		const point = new Point(x, y);
		matrix.apply(point, mPoint);
		matrix.apply(p, _mPoint);
		this.drawFoods(_mPoint);
		offsetCtx.clearRect(0, 0, screenWidth, screenHeight);
		offsetCtx.drawImage(_offsetCtx.canvas, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		sprite.texture.update();
	}
}
export default FoodsManager;