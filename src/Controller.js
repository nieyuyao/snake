import {
	Texture,
	Container,
	Sprite,
	Matrix
} from 'pixi.js';
import EventController from './EventController.js';
import { Sphere } from './Bound.js';

class Controller {
	constructor(app, map, snake) {
		this.name = 'controller';
		this.container = new Container();
		this.app = app;
		this.map = map; //地图
		this.snake = snake;
		EventController.subscribe(this);
	}
	init() {
		this.controlBack = new Sprite(Texture.fromFrame('control-back.png'));
		this.controlRocker = new Sprite(Texture.fromFrame('control-rocker.png'));
		this.controlFlash = new Sprite(Texture.fromFrame('control-flash.png'));
		this.controlFlashPressed = new Sprite(Texture.fromFrame('control-flash-pressed.png'));
		
		const {
			container,
			controlBack,
			controlRocker,
			controlFlash,
			controlFlashPressed
		} = this;

		controlBack.anchor.set(0.5, 0.5);
		controlBack.position.set(150, 260);
		container.addChild(controlBack);

		controlRocker.anchor.set(0.5, 0.5);
		controlRocker.position.set(150, 260);
		container.addChild(controlRocker);

		controlFlash.anchor.set(0.5, 0.5);
		controlFlash.position.set(800 - 150, 260);
		container.addChild(controlFlash);

		controlFlashPressed.anchor.set(0.5, 0.5);
		controlFlashPressed.position.set(800 - 150, 260);
		controlFlashPressed.visible = false;
		container.addChild(controlFlashPressed);

		const {normalizeDirec, contraryVector, app, map, snake} = this;
		const self = this;
		this.pointerHandler = {
			isControlPointerDown: false, //是否点击了控制区域
			controlBackOrigin: {
				x: 150,
				y: 260
			},
			controlBackBounding: new Sphere(150, 260, 40), //设置控制区域所在的圆，用于计算点击位置是否在包围圆内
			controlFlashPressedBouding: new Sphere(800 - 150, 260, 40),
			matrix: new Matrix(),
			accOrSlowDown: 1,
			advanceCallback: function (accOrSlowDown) {
				if (accOrSlowDown === -1) {
					app.ticker.remove(this.advance, this);
				}
			},
			advance: function () {
				map.advance(this.accOrSlowDown, this.advanceCallback, this);
			},
			pointerDown(e) {
				if (this.controlBackBounding.surroundPoint(e.point)) {
					this.isControlPointerDown = true;
					self.setRockerPos(this.matrix, e.point, this.controlBackOrigin);
					//更新地图移动的方向
					const direc = normalizeDirec({x: -e.point.x + this.controlBackOrigin.x, y: -e.point.y + this.controlBackOrigin.y});
					map.setVec(
						direc,
						false,
						-1
					);
					snake.turnAround(contraryVector(direc));
				}
				if (this.controlFlashPressedBouding.surroundPoint(e.point)) {
					this.accOrSlowDown = 1;
					app.ticker.add(this.advance, this);
					self.toggleFlashPressed(true);
				}
			},
			pinterMove(e) {
				if (this.isControlPointerDown) {
					self.setRockerPos(this.matrix, e.point, this.controlBackOrigin);
					const direc = normalizeDirec({x: -e.point.x + this.controlBackOrigin.x, y: -e.point.y + this.controlBackOrigin.y});
					//更新地图移动的方向
					map.setVec(
						direc,
						false,
						-1
					);
					snake.turnAround(contraryVector(direc));
				}
			},
			pointerUp(e) {
				this.isControlPointerDown = false;
				controlRocker.position.set(this.controlBackOrigin.x, this.controlBackOrigin.y);
				if (this.controlFlashPressedBouding.surroundPoint(e.point)) {
					this.accOrSlowDown = -1;
					app.ticker.add(this.advance, this);
					self.toggleFlashPressed(false);
				}
			}
		}
	}
	eventHandler(ev) {
		const { pointerHandler } = this;
		/* eslint-disable */
		switch(ev.type) {
			case 'pointerdown':
				pointerHandler.pointerDown(ev);
				break;
			case 'pointermove':
				pointerHandler.pinterMove(ev);
				break;
			case 'pointerup':
				pointerHandler.pointerUp(ev);
				break;
		}
		/* eslint-enable */
	}
	//设置控制球的位置
	setRockerPos(matrix, p2, p1) {
		const {
			controlRocker
		} = this;
		const d = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
		if (d > (80 - 35) / 2) {
			matrix.tx = (80 - 35) / 2 * (p2.x - p1.x) / d;
			matrix.ty = (80 - 35) / 2 * (p2.y - p1.y) / d;
			controlRocker.position = matrix.apply(p1);
		} else {
			controlRocker.position.set(p2.x, p2.y);
		}
	}
	//加速显示开关
	toggleFlashPressed(show = false) {
		const { controlFlashPressed } = this;
		controlFlashPressed.visible = show;
	}
	//向量归一化
	normalizeDirec(direc) {
		const {x, y} = direc;
		const l = Math.sqrt(x * x + y * y)
		return {
			x: x / l,
			y: y / l
		}
	}
	//获取相反向量
	contraryVector(v) {
		return {
			x: -v.x,
			y: -v.y
		}
	}
}
export default Controller;