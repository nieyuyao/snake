import { Matrix } from 'pixi.js';

export const FOOD_NUM_MAX = 1000;	//食物的最大数量
export const FOOD_NUM_MIN = 100;	//食物的最小数量
export const _OFFSET_CANVAS_WIDTH = 3000; //食物绘图离屏canvas的宽
export const _OFFSET_CANVAS_HEIGHT = 1500;	//食物绘图离屏canvas的高
export const HORIZONTAL_DIVISION_NUM = 30;	//食物绘图区x方向划分个数
export const VERTICAL__DIVISION_NUM = 15;	//食物绘图区y方向划分个数
export const DIVISION_WIDTH = 100;	//划分区域宽高
export const INITIAL_SNAKE_BODY_NUM = 4; //蛇刚开始时的body数量
export const MAX_PLAYERS_NUM = 30; //最多的玩家数目
export const MAP_TO_SCREEN_MATRIX = new Matrix(1, 0, 0, 1, 0, 0); // 矩阵 地图坐标=>屏幕坐标

export const UPDATE_SCORE = 'update-socre';
export const UPDATE_MAP = 'update-map';
export const UPDATE_FOODS = 'update-foods';
export const COLLISION = 'collision';

export const SCREEN = {
	width: 0,
	height: 0
};