import * as React from "react";
import { usePromise } from "../core/hooks";
import { GameContext } from "../gameContext";

export const App = ({ onChampionReady }: { onChampionReady?: () => void }) => {
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
			{onChampionReady && <button onClick={() => onChampionReady()}>Télécharger</button>}
		</>
	);
};
