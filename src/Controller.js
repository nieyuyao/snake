import {
	Texture,
	Container,
	Sprite,
	Matrix,
	Graphics,
	Text
} from 'pixi.js';
import EventController from './event/EventController';
import { Sphere } from './utils/Bound';
import { SCREEN, CONTROLLER_BASE_WIDTH, CONTROLLER_BASE_HEIGHT, SCORE_WIDTH, SCORE_HEIGHT } from './utils/constants';

class Controller {
	constructor(app, map, mySnake) {
		this.name = 'controller';
		this.container = new Container();
		this.app = app;
		this.map = map; //地图
		this.mySnake = mySnake;
		this.scoreTexts = [];
	}
	init() {
		this.controlBack = new Sprite(Texture.fromFrame('control-back.png'));
		this.controlRocker = new Sprite(Texture.fromFrame('control-rocker.png'));
		this.controlFlash = new Sprite(Texture.fromFrame('control-flash.png'));
		this.controlFlashPressed = new Sprite(Texture.fromFrame('control-flash-pressed.png'));
		this.cancel = new Sprite(Texture.fromFrame('btn-back.png')); //返回按钮
		this.score = new Container();

		const {
			container,
			controlBack,
			controlRocker,
			controlFlash,
			controlFlashPressed,
			cancel,
			score
		} = this;

		controlBack.anchor.set(0.5, 0.5);
		controlBack.position.set(150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height);
		container.addChild(controlBack);

		controlRocker.anchor.set(0.5, 0.5);
		controlRocker.position.set(150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height);
		container.addChild(controlRocker);

		controlFlash.anchor.set(0.5, 0.5);
		controlFlash.position.set(SCREEN.width - 150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height);
		container.addChild(controlFlash);

		controlFlashPressed.anchor.set(0.5, 0.5);
		controlFlashPressed.position.set(SCREEN.width - 150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height);
		controlFlashPressed.visible = false;
		container.addChild(controlFlashPressed);
		
		cancel.anchor.set(0.5, 0.5);
		cancel.position.set(150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 40 / CONTROLLER_BASE_HEIGHT * SCREEN.height)
		container.addChild(cancel);

		score.width = SCORE_WIDTH;
		score.height = SCORE_HEIGHT;
		score.position.set(SCREEN.width - SCORE_WIDTH, 0);
		const graphics = new Graphics();
		graphics.beginFill(0x000000, 0.4);
		graphics.drawRect(0, 0, SCORE_WIDTH, SCORE_HEIGHT);
		graphics.endFill();
		score.addChild(graphics);
		container.addChild(score);

		const {normalizeDirec, contraryVector, app, mySnake} = this;

		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 18,
			fill: '#ffffff' // gradient
		});

		const self = this;
		this.pointerHandler = {
			isControlPointerDown: false, //是否点击了控制区域
			controlBackOrigin: {
				x: 150 / CONTROLLER_BASE_WIDTH * SCREEN.width,
				y: 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height
			},
			controlBackBounding: new Sphere(150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height, 40), //设置控制区域所在的圆，用于计算点击位置是否在包围圆内
			controlFlashPressedBouding: new Sphere(SCREEN.width - 150 / CONTROLLER_BASE_WIDTH * SCREEN.width, 260 / CONTROLLER_BASE_HEIGHT * SCREEN.height, 40),
			matrix: new Matrix(),
			accOrSlowDown: 1,
			advanceCallback: function (accOrSlowDown) {
				if (accOrSlowDown === -1) {
					app.ticker.remove(this.advance, this);
				}
			},
			advance: function () {
				mySnake.advance(this.accOrSlowDown, this.advanceCallback, this);
			},
			pointerDown(e) {
				if (this.controlBackBounding.surroundPoint(e.val)) {
					this.isControlPointerDown = true;
					self.setRockerPos(this.matrix, e.val, this.controlBackOrigin);
					//更新地图移动的方向
					const direc = normalizeDirec({x: -e.val.x + this.controlBackOrigin.x, y: -e.val.y + this.controlBackOrigin.y});
					mySnake.turnAround(contraryVector(direc));
				}
				if (this.controlFlashPressedBouding.surroundPoint(e.val)) {
					this.accOrSlowDown = 1;
					app.ticker.add(this.advance, this);
					self.toggleFlashPressed(true);
				}
			},
			pinterMove(e) {
				if (this.isControlPointerDown) {
					self.setRockerPos(this.matrix, e.val, this.controlBackOrigin);
					const direc = normalizeDirec({x: -e.val.x + this.controlBackOrigin.x, y: -e.val.y + this.controlBackOrigin.y});
					mySnake.turnAround(contraryVector(direc));
				}
			},
			pointerUp(e) {
				this.isControlPointerDown = false;
				controlRocker.position.set(this.controlBackOrigin.x, this.controlBackOrigin.y);
				if (this.controlFlashPressedBouding.surroundPoint(e.val)) {
					this.accOrSlowDown = -1;
					app.ticker.add(this.advance, this);
					self.toggleFlashPressed(false);
				}
			}
		}
		this.registerEventHandler();
	}
	registerEventHandler() {
		const { pointerHandler } = this;
		EventController.subscribe('pointerdown', ev => {
			pointerHandler.pointerDown(ev);
		});
		EventController.subscribe('pointermove', ev => {
			pointerHandler.pinterMove(ev);
		});
		EventController.subscribe('pointerup', ev => {
			pointerHandler.pointerUp(ev);
		});
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