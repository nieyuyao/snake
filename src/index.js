import {
	loaders,
	Text,
	TextStyle,
	Application
} from 'pixi.js';
import Game from './Game';
import source from './source';
import { SCREEN, _OFFSET_CANVAS_WIDTH, _OFFSET_CANVAS_HEIGHT } from './utils/constants'

const width = document.getElementById('app').offsetWidth;
const height = document.getElementById('app').offsetHeight;
const app = new Application({
	width,
	height
});
if (width < height) {
	app.shouldHorizontalScreen = true;
}
document.querySelector('#app').appendChild(app.view);

const loadingTexts = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
let lt = 0;
let sign = 1;
let delta = 0;
const loadingText = new Text(
	loadingTexts[lt],
	new TextStyle({
		fontSize: 36,
		fill: 'white'
	})
);

/* 初始化常量 */
SCREEN.width = app.screen.width;
SCREEN.height = app.screen.height;

app.start();
app.ticker.add(() => {
	if (delta < 600) {
		delta += 1000 / app.ticker.FPS;
		return;
	}
	delta = 0;
	lt = lt + sign;
	if (lt === 4) {
		lt = 2;
		sign = -1;
	} else if (lt == -1) {
		lt = 1;
		sign = 1;
	}
	loadingText.text = loadingTexts[lt];
});

const loader = new loaders.Loader();
loadingText.anchor.set(0.5, 0.5);
loadingText.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(loadingText);

for (const key in source) {
	const src = source[key];
	loader.add(key, src);
}
// 加载资源
loader.load(() => {
	app.stage.removeChild(loadingText);
	const game = new Game(app);
	window.game = game;
	// 启动游戏
	game.init();
});