import { Network } from "neat";
import { Position } from "./position";
import { RaceMap } from "./raceMap";

const sensorDelta = 1;
export class Car {
	readonly sensorRange = 200;
	readonly width = 36;
	readonly height = 18;
	readonly maxSpeed = 1000;
	readonly name?: string;
	speed: number = 0;
	direction: number = Math.PI / 4;
	brain?: Network;
	activatedSensors: number[] = [0, 0, 0];
	frozen: boolean = false;
	pos: Position;
	checkPoints: number = 0;
	lastCheckPoint: number | null = null;
	distanceToLastCheckPoint: number = 0;

	constructor(x: number, y: number, brain?: Network, name?: string) {
		this.pos = new Position(x, y);
		this.brain = brain;
		this.name = name;
	}

	accelerate = () => {
		this.speed += 10;
	};

	brake = () => {
		this.speed -= 10;
	};

	turn = (direction: "right" | "left") => {
		if (!this.frozen) {
			this.direction += 0.1 * (direction === "right" ? 1 : -1);
			this.speed *= 0.99;
		}
	};

	checkCollisions = (map: RaceMap, nextPosX: number, nextPosY: number) => {
		const sensorsActivated = [false, false, false];
		for (let k = 0; k < this.sensorRange; k += sensorDelta) {
			const firstSensorPos = {
				x: Math.floor(this.pos.x + this.width / 2 + k * Math.cos(this.direction - Math.PI / 4)),
				y: Math.floor(this.pos.y + this.height / 2 + k * Math.sin(this.direction - Math.PI / 4)),
			};
			const secondSensorPos = {
				x: Math.floor(this.pos.x + this.width / 2 + k * Math.cos(this.direction)),
				y: Math.floor(this.pos.y + this.height / 2 + k * Math.sin(this.direction)),
			};
			const thirdSensorPos = {
				x: Math.floor(this.pos.x + this.width / 2 + k * Math.cos(this.direction + Math.PI / 4)),
				y: Math.floor(this.pos.y + this.height / 2 + k * Math.sin(this.direction + Math.PI / 4)),
			};
			const sensors = [firstSensorPos, secondSensorPos, thirdSensorPos];

			for (let i = 0; i < 3; i++) {
				if (sensorsActivated[i]) {
					continue;
				}
				if (
					sensors[i].x < 0 ||
					sensors[i].x > map.collisionMap.length - 1 ||
					sensors[i].y < 0 ||
					sensors[i].y > map.collisionMap.length - 1
				) {
					this.activatedSensors[i] = 1;
				} else {
					if (map.collisionMap[sensors[i].x][sensors[i].y]) {
						this.activatedSensors[i] = 0;
					} else {
						this.activatedSensors[i] = (this.sensorRange - k) / this.sensorRange;
						sensorsActivated[i] = true;
					}
				}
			}
		}

		try {
			if (!map.collisionMap[Math.floor(this.pos.x)][Math.floor(this.pos.y)]) {
				this.frozen = true;
			}
		} catch (e) {
			console.log("failed to check position", Math.floor(this.pos.x), Math.floor(this.pos.y));
			throw e;
		}

		for (let i = 0; i < map.checkPoints.length; i++) {
			const checkPoint = map.checkPoints[i];
			if (this.lastCheckPoint !== i && checkPoint.passed(this.pos, new Position(nextPosX, nextPosY))) {
				this.lastCheckPoint = i;
				this.checkPoints++;
			}
		}
	};

	update = (map: RaceMap, delta: number) => {
		if (!this.frozen) {
			const nextPosX = this.pos.x + this.speed * Math.cos(this.direction) * delta;
			const nextPosY = this.pos.y + this.speed * Math.sin(this.direction) * delta;

			this.checkCollisions(map, nextPosX, nextPosY);
			this.speed *= 0.999;
			if (this.speed < 9) {
				this.speed = 0;
			}
			if (this.speed > this.maxSpeed) {
				this.speed = this.maxSpeed;
			}
			this.distanceToLastCheckPoint =
				this.lastCheckPoint == null ? 0 : map.checkPoints[this.lastCheckPoint].distanceTo(this.pos);
			this.pos.x = nextPosX;
			this.pos.y = nextPosY;
		}
	};
}
