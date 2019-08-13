export class Vector2 {

	constructor(public x: number, public y: number) {}

	get norm(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	dot(v: Vector2): number {
		return this.x * v.x + this.y * v.y;
	}

	determinant(v: Vector2): number {
		return this.y * v.x - this.x * v.y;
	}

}
