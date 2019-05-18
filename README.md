### 基于Pixi.js实现的贪吃蛇游戏
#### 蛇蛇大作战，实现要点
- [x] 有限地图
- [x] 吃掉食物之后，蛇身边长
- [x] 蛇平滑转向
- [x] 蛇始终在屏幕中间
- [x] 蛇与食物碰撞
- [ ] AI蛇的实现
- 自动需找食物较多的地方
- [x] 遇到其他蛇的时候自动掉头
- [x] 相同的图片资源共用一个Texture
- [ ] Ai蛇加入的时候如何随机生成一个位置并与其他蛇的位置不重合
- [x] 如何判断两条蛇之间是否发生了碰撞

#### 解决问题
1. ~~当两条蛇相遇的时候如果方向夹角为90度，会导致蛇卡死在原位置【设置检测碰撞时间间隔】~~
2. ~~Ai蛇比原本的蛇速度要慢~~
3. ~~每条蛇上面增加分数属性~~
4. ~~蛇的死亡【死亡之后变成食物】~~
5. Ai蛇向食物的方向移动
6. 插值改进为根据角度插值
7. ~~吃食物之后蛇的身体边长~~
8. ~~iphoneX样式兼容~~
9. ~~增加控制区域大小~~
10. 分数面板增加滚动
11. ~~增加两点触控~~
12. ~~支持横屏~~

#### 预览图
![](https://s.momocdn.com/w/u/others/2019/05/18/1558166372330-snake-1.gif)

![](https://s.momocdn.com/w/u/others/2019/05/18/1558166371022-snake-2.gif)

#### 启动方法

```
npm run dev
```
#### 打包

```
npm build
```