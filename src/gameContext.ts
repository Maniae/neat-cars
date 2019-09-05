import * as React from "react";
import { Game } from "./core/game";
import { CarService } from "./services/carService";
import { DrawService } from "./services/drawService";
import { PopulationService } from "./services/populationService";

export const GameContext = React.createContext<{
	carService: CarService;
	populationService?: PopulationService;
	drawService: DrawService;
	game: Game;
}>(null as any);
