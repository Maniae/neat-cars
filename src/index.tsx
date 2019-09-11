import { Network } from "neat";
import * as React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { Game } from "./core/game";
import { GameContext } from "./gameContext";
import { CarService } from "./services/carService";
import { DrawService } from "./services/drawService";
import { PopulationService } from "./services/populationService";
import { App } from "./ui/app";

const socket = io("192.168.8.94:3000");

socket.on("welcome", () => {
	console.log("Connected");
});

const main = document.getElementById("main");
if (!main) {
	throw Error("React root not found");
}

const game = new Game();
const carService = new CarService(game);

const populationService = new PopulationService(game, carService);
const drawService = new DrawService(game, carService);

ReactDOM.render(
	<GameContext.Provider value={{ game, populationService, carService, drawService }}>
		<App
			onChampionReady={(name: string) => {
				const bestCar = populationService.getBestCar();
				if (!bestCar) {
					console.warn("Couldn't retrieve best Car");
					return;
				}

				const brain = Network.toJson(bestCar.brain);
				const decisionFunction = carService.updateCar.toString();

				const champion = JSON.stringify({ brain, name, decisionFunction });

				socket.emit("champion", champion);
			}}
		/>
	</GameContext.Provider>,
	main
);
