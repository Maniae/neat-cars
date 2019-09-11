import { Signal } from "micro-signals";

export class Game {
	onUpdate = new Signal<void>();
	loop = 0;
	running = false;

	start() {
		if (this.running) {
			return;
		}
		this.running = true;
		cancelAnimationFrame(this.loop);
		this.update();
	}

	private update() {
		this.onUpdate.dispatch();
		this.loop = requestAnimationFrame(() => this.update());
	}
}
