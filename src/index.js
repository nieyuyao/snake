import Game from './Game.js';
import source from './source.js';
import {
	loaders,
	Text,
	TextStyle,
	Application
} from 'pixi.js';

const app = new Application({
	height: 400
});
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

loader.load(() => {
	app.stage.removeChild(loadingText);
	const game = new Game(app);
	game.init();
});