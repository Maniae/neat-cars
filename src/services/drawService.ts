import { Game } from "../core/game.js";
import { Car } from "../domain/car";
import { RaceMap } from "../domain/raceMap";
import { CarService } from "./carService.js";

const carImage = new Image();
carImage.src = require("../../assets/car.png");
const mapImage = new Image();
mapImage.src = require("../../assets/raceMap.png");

export class DrawService {
	private canvas!: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;

	constructor(private game: Game, private carService: CarService) {
		game.onUpdate.add(() => this.update());
	}

	async init() {
		this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		await loadImage(carImage);
		await loadImage(mapImage);
	}

	update() {
		const cars = this.carService.cars;

		const raceMap = this.carService.raceMap;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawMapAndCheckPoints(raceMap);
		cars.map(car => {
			this.drawCar(car);
		});
	}

	drawMapAndCheckPoints(raceMap: RaceMap) {
		this.ctx.drawImage(mapImage, 0, 0);
		this.ctx.strokeStyle = "green";
		raceMap.checkPoints.map(it => this.drawLine(it.pos1.x, it.pos1.y, it.pos2.x, it.pos2.y));
	}

	drawCar(car: Car) {
		this.ctx.save();
		this.ctx.translate(car.pos.x, car.pos.y);
		this.ctx.translate(car.width / 2, car.height / 2);
		if (car.name) {
			this.ctx.font = "20px Arial";
			this.ctx.fillStyle = "#B8336A";
			this.ctx.fillText(car.name, -20, -20);
		}
		this.ctx.rotate(car.direction);
		this.ctx.drawImage(carImage, -car.width / 2, -car.height / 2, car.width, car.height);
		if (!car.frozen) {
			this.ctx.strokeStyle = car.activatedSensors[0] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange / Math.SQRT2, -car.sensorRange / Math.SQRT2);
			this.ctx.strokeStyle = car.activatedSensors[1] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange, 0);
			this.ctx.strokeStyle = car.activatedSensors[2] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange / Math.SQRT2, car.sensorRange / Math.SQRT2);
		}
		this.ctx.restore();
	}

	drawLine(x1: number, y1: number, x2: number, y2: number) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}
}

const loadImage = (image: HTMLImageElement) =>
	new Promise<HTMLImageElement>(resolve => {
		image.onload = () => {
			resolve(image);
		};
		if (image.complete) {
			resolve(image);
		}
	});
