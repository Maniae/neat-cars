import * as React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { Game } from "./core/game";
import { GameContext } from "./gameContext";
import { CarService } from "./services/carService";
import { DrawService } from "./services/drawService";
import { PopulationService } from "./services/populationService";

const main = document.getElementById("main");
if (!main) {
	throw Error("React root not found");
}

const game = new Game();
const carService = new CarService(game);
const populationService = new PopulationService(game, carService);
const drawService = new DrawService(game, carService);

// drawService.init().then(() => {
ReactDOM.render(
	<GameContext.Provider value={{ game, carService, populationService, drawService }}>
		<App />
	</GameContext.Provider>,
	main
);
// });
