import { Map } from "immutable";
import { Network } from "neat";
import * as React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { START_X, START_Y } from "./core/constants";
import { Game } from "./core/game";
import { Car } from "./domain/car";
import { Champion } from "./domain/champion";
import { GameContext } from "./gameContext";
import { CarService } from "./services/carService";
import { DrawService } from "./services/drawService";
import { App } from "./ui/app";

const socket = io("http://localhost:3000");

socket.on("welcome", () => {
	console.log("Connected");
	socket.emit("admin");
});

const main = document.getElementById("main");
if (!main) {
	throw Error("React root not found");
}

const game = new Game();
const carService = new CarService(game);
let decisionFunctions = Map<Car, (car: Car) => void>();

carService.updateCar = (car: Car) => decisionFunctions.get(car)!.apply(carService, [car]);

const drawService = new DrawService(game, carService);

socket.on("champion", (champion: Champion) => {
	// TODO ACTIVATION
	const car = new Car(START_X, START_Y, Network.fromJson(champion.brain, x => x), champion.name);
	const decisionFunction = new Function(`return ${champion.decisionFunction}`)();

	decisionFunctions = decisionFunctions.set(car, decisionFunction);

	carService.startRace(carService.cars.push(car));
});

ReactDOM.render(
	<GameContext.Provider value={{ game, carService, drawService }}>
		<App />
	</GameContext.Provider>,
	main
);
