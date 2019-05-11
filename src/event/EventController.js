/* eslint-disable no-console  */
export default {
	recievers: [],
	subscribe(reciever) {
		if (reciever.eventHandler) {
			this.recievers.push(reciever);
			return;
		}
		console.warn('reciever must have a eventHandler function');
	},
	publish(ev) {
		this.recievers.forEach(reciever => {
			reciever.eventHandler(ev);
		}) 
	},
	remove(reciever) {
		for (let i = 0; i < this.recievers.length; i++) {
			if (this.recievers[i] === reciever) {
				break;
			}
		}
		this.recievers.splice(i, 1);
	}
}