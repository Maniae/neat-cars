import { Network } from "neat";
import * as React from "react";
import { usePromise } from "../core/hooks";
import { GameContext } from "../gameContext";

export const App = () => {
	const { game, drawService, carService, populationService } = React.useContext(GameContext);
	const { loading } = usePromise(() => drawService.init());

	return (
		<>
			{loading ? (
				<div>Chargement...</div>
			) : (
				<button style={{ padding: "5px 10px" }} onClick={() => game.start()}>
					GO
				</button>
			)}
			<canvas width={1012} height={750} />
			<button
				onClick={() => {
					if (!populationService) {
						return;
					}
					const bestCar = populationService.getBestCar();
					if (!bestCar) {
						console.warn("Couldn't retrieve best Car");
						return;
					}

					const brain = Network.toJson(bestCar.brain);
					const name = "Tom";
					const decisionFunction = carService.update.toString();

					const champion = JSON.stringify({ brain, name, decisionFunction });

					const element = document.createElement("a");
					const file = new Blob([champion], { type: "application/json" });
					element.href = URL.createObjectURL(file);
					element.download = `brain.json`;
					element.click();
				}}
			>
				Télécharger
			</button>
		</>
	);
};
