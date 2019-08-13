export class Position {

	constructor(public x: number, public y: number) {}

	distanceTo = (other: Position) => {
		return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
	}
}
