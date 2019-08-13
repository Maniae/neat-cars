import { List } from "immutable";
import { Game } from "../core/game";
import raceMapJson from "../data/raceMap.json";
import { Car } from "../domain/car";
import { RaceMap } from "../domain/raceMap";

export class CarService {
	cars: List<Car> = List();
	raceMap: RaceMap = RaceMap.fromJson(raceMapJson);
	racing = false;

	constructor(private game: Game) {}

	startRace(cars: List<Car>) {
		this.cars = cars;
		this.racing = true;
		this.game.onUpdate.add(() => this.update, this);
	}

	stopRace() {
		this.racing = false;
		this.game.onUpdate.remove(this);
	}

	update() {
		this.cars.forEach(car => {
			car.accelerate();
			this.updateCarPosition(car);
		});
	}

	updateCarPosition(car: Car) {
		if (!car.frozen) {
			const nextPosX = car.pos.x + car.speed * Math.cos(car.direction);
			const nextPosY = car.pos.y + car.speed * Math.sin(car.direction);

			car.checkCollisions(this.raceMap, nextPosX, nextPosY);
			car.speed *= 0.999;
			if (car.speed < 9) {
				car.speed = 0;
			}
			if (car.speed > car.maxSpeed) {
				car.speed = car.maxSpeed;
			}
			car.distanceToLastCheckPoint =
				car.lastCheckPoint == null ? 0 : this.raceMap.checkPoints[car.lastCheckPoint].distanceTo(car.pos);
			car.pos.x = nextPosX;
			car.pos.y = nextPosY;
		}
	}
}
