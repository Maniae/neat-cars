import { Signal } from "micro-signals";

export class Game {
	onUpdate = new Signal<void>();
	loop = 0;

	start() {
		cancelAnimationFrame(this.loop);
		this.update();
	}

	private update() {
		this.onUpdate.dispatch();
		this.loop = requestAnimationFrame(() => this.update());
	}
}
