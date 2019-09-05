import * as React from "react";
import ReactDOM from "react-dom";
import { Game } from "./core/game";
import { GameContext } from "./gameContext";
import { CarService } from "./services/carService";
import { DrawService } from "./services/drawService";
import { PopulationService } from "./services/populationService";
import { App } from "./ui/app";

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
		<App />
	</GameContext.Provider>,
	main
);
