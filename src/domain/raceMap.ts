import { CheckPoint } from "./checkPoint";

export class RaceMap {
	constructor(readonly collisionMap: number[][], readonly checkPoints: CheckPoint[]) {}

	static fromJson(json: any): RaceMap {
		return new RaceMap(json.collisionMap, json.checkPoints.map((it: any) => CheckPoint.fromJson(it)));
	}
}
