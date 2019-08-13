import { Signal } from "micro-signals";

export class Game {
	onUpdate = new Signal<void>();

	start() {
		this.update();
	}

	private update() {
		this.onUpdate.dispatch();
		requestAnimationFrame(() => this.update());
	}
}
