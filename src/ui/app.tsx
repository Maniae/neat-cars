import * as React from "react";
import styled from "styled-components";
import { usePromise } from "../core/hooks";
import { GameContext } from "../gameContext";

export const App = ({ onChampionReady }: { onChampionReady?: (name: string) => void }) => {
	const { game, drawService } = React.useContext(GameContext);
	const { loading } = usePromise(() => drawService.init());
	const [name, setName] = React.useState("");
	const [nameLocked, setNameLocked] = React.useState(false);

	return (
		<Container>
			{onChampionReady && (
				<input
					disabled={nameLocked}
					placeholder="Nom du champion"
					value={name}
					onChange={e => setName(e.currentTarget.value)}
				></input>
			)}
			{loading ? <div>Chargement...</div> : <button onClick={() => game.start()}>Go</button>}
			<canvas width={1012} height={750} />
			{onChampionReady && (
				<button
					onClick={() => {
						if (!name) {
							alert("Pas de nom, pas de champion");
							return;
						}
						setNameLocked(true);
						onChampionReady(name);
					}}
				>
					Télécharger
				</button>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: "Montserrat", "Open Sans", sans-serif;

	button {
		font-family: "Montserrat", "Open Sans", sans-serif;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 20px;
		margin: 10px;
		border: none;
		background-color: blue;
		outline: none;
		color: white;
		font-size: 16px;
		box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 40px 0px;
	}

	input {
		outline: none;
		padding: 5px 10px;
		border: none;
		box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 40px 0px;
		margin: 20px;
	}
`;
