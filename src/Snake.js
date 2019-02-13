import SnakeBody from './SnakeBody.js';
import { Container } from 'pixi.js';
import EventController from './EventController.js';

class Snake {
	constructor(app) {
		this.name = 'snake';
		this.head = null;
		this.bodies = [];
		this.cate = 1; //类别
		this.app = app;
		this.container = new Container();
		this.shouldMoveHead = false;
		this.v = 2; //初始速度
	}
	init() {
		const { app, bodies, update } = this;

		this.head = new SnakeBody(null, this.cate, 'head', {x: app.screen.width, y: app.screen.height});
		const { container, head } = this;
		head.sprite.position.set(app.screen.width / 2, app.screen.height / 2);
		container.addChild(this.head.sprite);

		const body1 = new SnakeBody(this.head, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body2 = new SnakeBody(body1, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body3 = new SnakeBody(body2, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body4 = new SnakeBody(body3, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body5 = new SnakeBody(body4, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body6 = new SnakeBody(body5, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body7 = new SnakeBody(body6, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body8 = new SnakeBody(body7, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body9 = new SnakeBody(body8, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body10 = new SnakeBody(body9, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body11 = new SnakeBody(body10, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body12 = new SnakeBody(body11, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body13 = new SnakeBody(body12, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body14 = new SnakeBody(body13, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body15 = new SnakeBody(body14, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body16 = new SnakeBody(body15, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body17 = new SnakeBody(body16, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		const body18 = new SnakeBody(body17, this.cate, 'body', {x: app.screen.width, y: app.screen.height});
		bodies.push(body1);
		bodies.push(body2);
		bodies.push(body3);
		bodies.push(body4);
		bodies.push(body5);
		bodies.push(body6);
		bodies.push(body7);
		bodies.push(body8);
		bodies.push(body9);
		bodies.push(body10);
		bodies.push(body11);
		bodies.push(body12);
		bodies.push(body13);
		bodies.push(body14);
		bodies.push(body15);
		bodies.push(body16);
		bodies.push(body17);
		bodies.push(body18);

		for (let i = 0; i < 18; i++) {
			const body = bodies[i];
			container.addChild(body.sprite);
		}
		const self = this;
		const aheadMapBoundHandler = {
			eventHandler(ev) {
				if (ev.type === 'ahead-map-bound') {
					self.shouldMoveHead = true;
					self.v = ev.point.x;
				}
			}
		}
		EventController.subscribe(aheadMapBoundHandler);
		app.ticker.add(update, this);
	}
	//转向
	turnAround(direc) {
		this.head.setHeadDirec(direc);
	}
	//吃掉食物之后，增加一个蛇身体
	addBody() {
	}
	//每帧更新
	update() {
		if (this.shouldMoveHead) {
			this.head.updateHeadPos(this.v);
		}
		this.head.updateHeadDirec();
		for (let i = this.bodies.length - 1; i >= 0; i--) {
			this.bodies[i].update();
		}
	}
}

export default Snake;