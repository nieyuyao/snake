import {
	Sprite,
	Texture,
	Point,
	Matrix
} from 'pixi.js';
import Food from './Food';
import EventController from './EventController';
import Event from './Event';
import {
	Sphere
} from './Bound';

import {
	FOOD_NUM_MAX,
	FOOD_NUM_MIN,
	_OFFSET_CANVAS_WIDTH,
	_OFFSET_CANVAS_HEIGHT,
	HORIZONTAL_DIVISION_NUM,
	VERTICAL__DIVISION_NUM,
	DIVISION_WIDTH,
	UPDATE_SCORE,
	UPDATE_FOODS
} from './constants';

class FoodsManager {
	constructor(app) {
		this.name = 'foodsmanager';
		this.app = app;
		this.foods = [];
		this.idleOrder = 0; //表示食物列表空闲的最小值，防止每次遍历食物列表都从0开始，降低时间复杂度
		this.bound = null; //裁剪区的边界
		this.timer = -1; //计时器
		this.delay = -1; //计时器间隔
		this.screenWidth = app.screen.width;
		this.screenHeight = app.screen.height;

		let _offsetCanvas = document.createElement('canvas'); //用来画食物的离屏canvas
		_offsetCanvas.width = _OFFSET_CANVAS_WIDTH;
		_offsetCanvas.height = _OFFSET_CANVAS_HEIGHT;
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
		this.division = {};
	}
	init() {
		const {
			_offsetCtx,
			offsetCtx,
			screenWidth,
			screenHeight,
			matrix,
			mPoint,
			_mPoint,
			division,
			mapImage
		} = this;
		this.bound = {
			left: screenWidth / 2 - _OFFSET_CANVAS_WIDTH / 2,
			right: screenWidth / 2 + _OFFSET_CANVAS_WIDTH / 2,
			top: screenHeight / 2 - _OFFSET_CANVAS_HEIGHT / 2,
			bottom: screenHeight / 2 + _OFFSET_CANVAS_HEIGHT / 2
		};
		//将食物绘图区划分为30*15份100*100的区域
		for (let i = 0; i < HORIZONTAL_DIVISION_NUM; i++) {
			for (let j = 0; j < VERTICAL__DIVISION_NUM; j++) {
				const key = `_${i}_${j}`;
				division[key] = {};
			}
		}
		for (let i = 0; i < FOOD_NUM_MIN; i++) {
			const food = this.createFood();
			_offsetCtx.drawImage(mapImage, food.imgX, food.imgY, food.w, food.h, food.x, food.y, food.w, food.h);
		}
		const point = new Point(400, 200);
		matrix.apply(point, mPoint);
		matrix.apply(point, _mPoint);
		// this.drawFoods(_mPoint);
		offsetCtx.drawImage(_offsetCtx.canvas, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		const texture = new Texture.fromCanvas(offsetCtx.canvas);
		this.sprite = new Sprite(texture);
		const self = this;
		const eventAdapter = {
			eventHandler(ev) {
				if (ev.type !== UPDATE_FOODS) {
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
		const {
			foods,
			app,
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
		const food = new Food(x, y, type, this.idleOrder, divisionKey, app.ticker);
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
	 * 画出食物
	 * @param {Point} p 蛇头相对于相对于食物绘图区的位置 {x, y}
	 */
	drawFoods(p) {
		const {
			_offsetCtx,
			foods,
			mapImage,
			boundingSphere,
			division
		} = this;
		boundingSphere.x = p.x;
		boundingSphere.y = p.y;
		//遍历蛇头所处位置的区域
		const ix = Math.floor(p.x / DIVISION_WIDTH);
		const iy = Math.floor(p.y / DIVISION_WIDTH);
		const key = `_${ix}_${iy}`;
		const foodOrders = Object.keys(division[key]);
		if (foodOrders.length === 0) {
			return;
		}
		// _offsetCtx.clearRect(0, 0, 3000, 1500);
		_offsetCtx.clearRect(ix * DIVISION_WIDTH, iy * DIVISION_WIDTH, DIVISION_WIDTH, DIVISION_WIDTH);
		for (let i = 0; i < foodOrders.length; i++) {
			const order = foodOrders[i]
			const food = foods[order];
			//如果对应下标的食物不存在
			if (!food) {
				continue;
			}
			//如果食物并未已经处在被吃状态，并且处在蛇的觅食范围内，执行吃食物方法
			if (!food.eaten && boundingSphere.surroundPoint({
				x: food.x,
				y: food.y
			})) {
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
		EventController.publish(new Event(UPDATE_SCORE));
	}
	/**
	 * 更新食物
	 * @param {Object} p 当前蛇头的位置{x, y}
	 */
	update(p) {
		let {
			x,
			y
		} = p;
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
		const {
			left,
			right,
			top,
			bottom
		} = this.bound;
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