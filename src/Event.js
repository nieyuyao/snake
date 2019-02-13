class Event {
	constructor(type = '', x = 0, y = 0) {
		this.type = type;
		this.point = {
			x: x,
			y: y
		}
	}
}
export default Event;