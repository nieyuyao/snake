import {
	Texture,
	Sprite,
	Matrix,
	Point
} from 'pixi.js';
import EventController from './EventController';
import {
	_OFFSET_CANVAS_WIDTH,
	_OFFSET_CANVAS_HEIGHT,
	UPDATE_MAP,
	MAP_TO_SCREEN_MATRIX
} from './constants';

class GameMap {
	constructor(app) {
		this.name = 'gamemap';
		this.sprite = null;
		this.screenWidth = app.screen.width;
		this.screenHeight = app.screen.height;
		//创建离屏canvas
		const offsetCanvas = document.createElement('canvas');
		offsetCanvas.width = this.screenWidth;
		offsetCanvas.height = this.screenHeight;
		this.offsetCtx = offsetCanvas.getContext('2d');
		this.mapImage = new Image();
		this.mapImage.src = '../assets/tile_map_1.png';
		this.mapImage.crossOrigin = '*';
		this.mPoint = new Point();
	}
	init() {
		const {
			offsetCtx,
			mapImage,
			screenWidth,
			screenHeight,
			mPoint
		} = this;
		this.bound = {
			left: screenWidth / 2 - _OFFSET_CANVAS_WIDTH / 2,
			right: screenWidth / 2 + _OFFSET_CANVAS_WIDTH / 2,
			top: screenHeight / 2 - _OFFSET_CANVAS_HEIGHT / 2,
			bottom: screenHeight / 2 + _OFFSET_CANVAS_HEIGHT / 2
		};
		const point = new Point(400, 200);
		MAP_TO_SCREEN_MATRIX.apply(point, mPoint);
		offsetCtx.drawImage(mapImage, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		const texture = new Texture.fromCanvas(offsetCtx.canvas);
		this.sprite = new Sprite(texture);
		const self = this;
		const eventAdapter = {
			eventHandler(ev) {
				if (ev.type !== UPDATE_MAP) {
					return;
				}
				self.update(ev.point);
			}
		}
		EventController.subscribe(eventAdapter);
	}
	/**
	 * 更新地图
	 * @param {Object} p 当前蛇头的位置{x, y}
	 */
	update(p) {
		let { x, y } = p; //x, y为图片裁剪区的中心
		const {
			sprite,
			mapImage,
			screenWidth,
			screenHeight,
			offsetCtx,
			mPoint
		} = this;
		this.transformToMapXY(x, y);
		offsetCtx.clearRect(0, 0, screenWidth, screenHeight);
		// 矩阵变化，蛇在屏幕中的坐标转化为地图的绝对坐标
		offsetCtx.drawImage(mapImage, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		sprite.texture.update();
	}
	/**
	 * 将蛇的坐标的坐标转化为地图中的绝对坐标
	 * @param {number} x 蛇头相对于屏幕的坐标x
	 * @param {number} y 蛇头相对于屏幕的坐标y
	 */
	transformToMapXY(x, y) {
		const { mPoint, bound, screenWidth, screenHeight } = this;
		const { left, right, top, bottom } = bound;
		// 判断地图是否已经超出边界
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
		MAP_TO_SCREEN_MATRIX.apply(point, mPoint);
	}
}
export default GameMap;