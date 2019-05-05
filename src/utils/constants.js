export const FOOD_NUM_MAX = 1000;	//食物的最大数量
export const FOOD_NUM_MIN = 100;	//食物的最小数量
export const _OFFSET_CANVAS_WIDTH = 3000; //食物绘图离屏canvas的宽
export const _OFFSET_CANVAS_HEIGHT = 1500;	//食物绘图离屏canvas的高
export const HORIZONTAL_DIVISION_NUM = 30;	//食物绘图区x方向划分个数
export const VERTICAL__DIVISION_NUM = 15;	//食物绘图区y方向划分个数
export const DIVISION_WIDTH = 100;	//划分区域宽高
export const INITIAL_SNAKE_BODY_NUM = 4; //蛇刚开始时的body数量
export const MAX_PLAYERS_NUM = 30; //最多的玩家数目
export const UPDATE_SCORE = 'update-socre';
export const UPDATE_MY_SNAKE = 'update-mysnake';
// export const UPDATE_FOODS = 'update-foods';
export const COLLISION = 'collision';
export const FOOD_CHECK_SPHERE_RADIUS = 20; //检测食物是否进入蛇的觅食范围的半径
export const SNAKE_COLLISON_RADIUS = 1600; //蛇的碰撞平方半径
export const SNAKE_BOUND = {
	left: 0,
	right: _OFFSET_CANVAS_WIDTH,
	top: 0,
	bottom: _OFFSET_CANVAS_HEIGHT
};
export const SCREEN = {
	width: 0,
	height: 0
};