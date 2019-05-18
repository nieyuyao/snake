import {
	Container,
	Sprite,
	Point,
	Texture
} from 'pixi.js';
import source from './source';
import {
	_OFFSET_CANVAS_WIDTH,
	_OFFSET_CANVAS_HEIGHT,
	SCREEN,
	SNAKE_BOUND
} from './utils/constants';


class GameMap {
	constructor() {
		this.name = 'gamemap';
		this.mPoint = new Point();
		this.fm = null; // 食物管理器
		this.sm = null; // 蛇管理器
		this.mapSprite = new Sprite(); //地图
		this.container = new Container();
		this.mySnake = null;
	}
	/**
	 * 初始化
	 * @param {FoodManager} fm
	 * @param {SnakeManager} sm
	 * @param {Snake} mySnake
	 */
	init(fm, sm, mySnake) {
		this.fm = fm;
		this.sm = sm;
		this.mySnake = mySnake;
		const { container, mapSprite } = this;
		// 初始化mapSprite
		mapSprite.texture = Texture.fromImage(source['tile_map_1.png']);
		mapSprite.name = 'MapSprite';
		// 初始化容器
		container.addChild(mapSprite);
		container.addChild(fm.container);
		container.addChild(sm.container);
		container.name = 'GameMap';
	}
	/**
	 * 更新地图
	 * @param {Point} p 当前蛇头的位置{x, y}
	 */
	update() {
		this.fm.update();
		this.sm.update();
		// 更新container位置
		this.calcMapCoorFromSnake();
		this.container.x = this.mPoint.x;
		this.container.y = this.mPoint.y;
	}
	/**
	 * 通过玩家自己的蛇的蛇头坐标(**绝对坐标**)计算出当前需要从地图上截取区域的中心位置
	 * @param {Point} sp 玩家自己的蛇的蛇头坐标
	 */
	calcMapCoorFromSnake() {
		const { mPoint, mySnake } = this;
		let { x, y } = mySnake.getPos();
		const { left, right, top, bottom } = SNAKE_BOUND;
		// 判断地图是否已经超出边界
		// 计算x
		if (x + SCREEN.width / 2 >= right) {
			x = right - SCREEN.width;
		}
		else if (x - SCREEN.width / 2 <= left) {
			x = left;
		} 
		else {
			x = x - SCREEN.width / 2;
		}
		// 计算y
		if (y + SCREEN.height / 2 >= bottom) {
			y = bottom - SCREEN.height;
		}
		else if (y - SCREEN.height / 2 <= top) {
			y = top;
		}
		else {
			y = y - SCREEN.height / 2;
		}
		mPoint.x = -x;
		mPoint.y = -y;
	}
	destory() {
		this.mapSprite.destroy();
		this.container.destroy();
	}
}
export default GameMap;