import Food from './Food.js';
import {
	Sprite,
	Texture,
	Point,
	Matrix
} from 'pixi.js';
import EventController from './EventController.js';
import { Sphere } from './Bound.js';

class FoodsManager {
	constructor(app) {
		this.foods = [];
		this.FOOD_NUM_MAX = 1000;
		this.INITIAL_FOOD_NUM = 200;
		this.bound = null;
		this.timer = -1;
		this.delay = 2000;
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
		this.boundSphere = new Sphere(0, 0, 10);
	}
	init() {
		const {
			_offsetCtx,
			offsetCtx,
			screenWidth,
			screenHeight,
			matrix,
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
		this.drawFoods();
		const point = new Point(400, 200);
		const mPoint = new Point();
		matrix.apply(point, mPoint);
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
		// this.generateFood();
	}
	/**
	 * 创建食物
	 */
	createFood() {
		for (var i = 0; i < this.foods.length; i++) {
			if (!this.foods[i]) {
				break;
			}
		}
		const x = Math.random() * 3000;
		const y = Math.random() * 1500;
		const type = Math.ceil(Math.random() * 6);
		const food = new Food(x, y, type, i);
		this.foods[i] = food;
	}
	/**
	 * 移除食物
	 * @param {Food} food 食物
	 */
	removeFood(food) {
		const order = food.order;
		this.container.removeChild(food.sprite);
		food.destroy();
		delete this.foods[order];
	}
	/**
	 * 自动生成食物
	 */
	generateFood() {
		const {
			foods,
			FOOD_NUM_MAX,
			createFood
		} = this;
		const generate = () => {
			if (foods.length < FOOD_NUM_MAX) {
				createFood();
			}
			setTimeout(generate, this.delay);
		}
		generate();
	}
	drawFoods() {
		const { _offsetCtx, foods, mapImage } = this;
		_offsetCtx.clearRect(0, 0, 3000, 1500);
		for (let i = 0; i < foods.length; i++) {
			const food = foods[i];
			_offsetCtx.drawImage(mapImage, food.imgX, food.imgY, food.w, food.h, food.x, food.y, food.w, food.h);
		}
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
			boundSphere
		} = this;
		this.drawFoods();
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
		boundSphere.x = x;
		boundSphere.y = y;
		const point = new Point(x, y);
		const mPoint = new Point();
		matrix.apply(point, mPoint);
		offsetCtx.clearRect(0, 0, screenWidth, screenHeight);
		offsetCtx.drawImage(_offsetCtx.canvas, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		sprite.texture.update();
	}
}
export default FoodsManager;