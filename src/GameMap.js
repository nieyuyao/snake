import {
	Texture,
	Sprite,
	Matrix,
	Point
} from 'pixi.js';
import EventController from './EventController.js';
import {
	_OFFSET_CANVAS_WIDTH,
	_OFFSET_CANVAS_HEIGHT
} from './constants.js';
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
		this.matrix = new Matrix(1, 0, 0, 1, 0, 0);
		this.mPoint = new Point();
	}
	init() {
		const {
			offsetCtx,
			mapImage,
			screenWidth,
			screenHeight,
			matrix,
			mPoint
		} = this;
		matrix.tx = (_OFFSET_CANVAS_WIDTH - screenWidth) / 2;
		matrix.ty = (_OFFSET_CANVAS_HEIGHT - screenHeight) / 2;
		this.bound = {
			left: screenWidth / 2 - _OFFSET_CANVAS_WIDTH / 2,
			right: screenWidth / 2 + _OFFSET_CANVAS_WIDTH / 2,
			top: screenHeight / 2 - _OFFSET_CANVAS_HEIGHT / 2,
			bottom: screenHeight / 2 + _OFFSET_CANVAS_HEIGHT / 2
		};
		const point = new Point(400, 200);
		matrix.apply(point, mPoint);
		offsetCtx.drawImage(mapImage, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		const texture = new Texture.fromCanvas(offsetCtx.canvas);
		this.sprite = new Sprite(texture);
		const self = this;
		const eventAdapter = {
			eventHandler(ev) {
				if (ev.type !== 'update-map') {
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
			matrix,
			mPoint
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
		offsetCtx.clearRect(0, 0, screenWidth, screenHeight);
		const point = new Point(x, y);
		matrix.apply(point, mPoint);
		offsetCtx.drawImage(mapImage, mPoint.x - screenWidth / 2, mPoint.y - screenHeight / 2, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight);
		sprite.texture.update();
	}
}
export default GameMap;