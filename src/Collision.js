
import { Rectangle, Sphere } from './Bound';

const Collisition = {
	/**
	 * 判断两个矩形是否碰撞
	 * @param {Rect} rect1 
	 * @param {*} rect2 
	 */
	rectCollide(rect1, rect2) {
		if (!rect1 instanceof Rectangle) {
			throw TypeError('arguments 1 must instance of Rectangle');
		}
		if (!rect2 instanceof Rectangle) {
			throw TypeError('arguments 2 must instance of Rectangle');
		}
	},
	/**
	 * 判断两个圆是否碰撞
	 * @param {*} sp1 
	 * @param {*} sp2 
	 */
	sphereCollide(sp1, sp2) {
		if (!sp1 instanceof Rectangle) {
			throw TypeError('arguments 1 must instance of Rectangle');
		}
		if (!sp2 instanceof Sphere) {
			throw TypeError('arguments 2 must instance of Rectangle');
		}
		const r = sp1.r + sp2.r;
		const dx = sp1.x - sp2.x;
		const dy = sp1.y - sp2.y;
		return dx * dx + dy * dy <= r * r;
	}
}

export default Collisition;