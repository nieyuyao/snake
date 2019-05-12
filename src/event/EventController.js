/* eslint-disable no-console  */
export default {
	handlers: {},
	subscribe(type, fn) {
		const { handlers } = this;
		if (!handlers[type]) {
			handlers[type] = [fn];
		} else {
			handlers[type].push(fn);
		}
	},
	publish(ev) {
		if (!ev.type) {
			console.error('event type not exist');
			return;
		}
		if (!this.handlers[ev.type]) {
			return;
		}
		this.handlers[ev.type].forEach(handler => {
			handler(ev);
		}) 
	},
	remove(type, fn) {
		const { handlers } = this;
		if (type && handlers[type]) {
			for (let i = handlers[type].length; i >= 0; i--) {
				if (fn === handlers[type][i]) {
					handlers[type].splice(i, 1);
				}
			}
		}
	}
}