import { TextStyle } from 'pixi.js';

export const FOOD_NUM_MAX = 1000;	//食物的最大数量
export const FOOD_NUM_MIN = 100;	//食物的最小数量
export const _OFFSET_CANVAS_WIDTH = 3000; //食物绘图离屏canvas的宽
export const _OFFSET_CANVAS_HEIGHT = 1500;	//食物绘图离屏canvas的高
export const HORIZONTAL_DIVISION_NUM = 30;	//食物绘图区x方向划分个数
export const VERTICAL__DIVISION_NUM = 15;	//食物绘图区y方向划分个数
export const DIVISION_WIDTH = 100;	//划分区域宽高
export const INITIAL_SNAKE_BODY_NUM = 4; //蛇刚开始时的body数量
export const MAX_PLAYERS_NUM = 30; //最多的玩家数目
export const SNAKE_DIE_EVENT_NAME = 'event_snake_die'; //蛇死亡事件
export const DIE_SNAKE_SCORE = 'event_die_score'; //蛇死亡之后通知分数变化以及通知食物管理器
export const FOOD_CHECK_SPHERE_RADIUS = 20; //检测食物是否进入蛇的觅食范围的半径
export const SNAKE_COLLISON_RADIUS = 1600; //蛇的碰撞平方半径
export const SNAKE_DIE_RADIUS = 100; //蛇的死亡碰撞半径
export const AI_SNAKE_WILL_COLLISION_TIME = 1000; //AI蛇每隔多长时间检测一次是否即将碰撞
export const ADD_BODY_PRE_SCORES = 5; // 每隔5分增长一节
export const SNAKE_A = 0.1; //蛇的加速度
export const SNAKE_VEC_MAX = 4; //蛇的最大速度
export const SNAKE_VEC_MIN = 2; //蛇的最小速度
export const SNAKE_VEC_0 = 2; //蛇的初始速度
export const CONTROLLER_BASE_WIDTH = 800; //控制器基准宽，用来计算定位
export const CONTROLLER_BASE_HEIGHT = 400; //控制器基准高，用来计算定位
export const SCORE_WIDTH = 100;
export const SCORE_HEIGHT = 200;
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
export const TEXTURES = {}; //纹理
export const SCORE_TEXT_STYLE = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 18,
	fill: '#ffffff'
});