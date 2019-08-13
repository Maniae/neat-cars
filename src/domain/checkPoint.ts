import { Position } from "./position";
import { Vector2 } from "./vector2";

export class CheckPoint {

	constructor(readonly pos1: Position, readonly pos2: Position) {}

	passed(previousPos: Position, nextPos: Position) {
		const AB = new Vector2(this.pos2.x - this.pos1.x, this.pos2.y - this.pos1.y);
		const pAM = new Vector2(previousPos.x - this.pos1.x, previousPos.y - this.pos1.y);
		const nAM = new Vector2(nextPos.x - this.pos1.x, nextPos.y - this.pos1.y);

		if (nAM.norm > AB.norm) {
			return false;
		}
		if (AB.dot(nAM) < 0) {
			return false;
		}

		return AB.determinant(nAM) === 0 || (AB.determinant(nAM) >= 0 && AB.determinant(pAM) <= 0);
	}

	distanceTo(pos: Position) {
		return new Position((this.pos2.x + this.pos1.x) / 2, (this.pos2.y + this.pos1.y) / 2).distanceTo(pos);
	}

	static fromJson(json: any) {
		return new CheckPoint(new Position(json.pos1.x, json.pos1.y), new Position(json.pos2.x, json.pos2.y));
	}
}
