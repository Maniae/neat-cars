import * as React from "react";
import styled from "styled-components";
import { useSignal } from "../core/hooks";
import { GameContext } from "../gameContext";

export const ScoreBoard: React.FC = () => {
	const { game, carService } = React.useContext(GameContext);
	const [cars, setCars] = React.useState(carService.cars);

	useSignal(game.onUpdate, () => setCars(carService.cars.sort((a, b) => a.checkPoints - b.checkPoints)));

	return (
		<Container>
			<Title>Scores :</Title>
			{cars.map(c => (
				<ScoreRow>
					<span>{c.name}</span>
					<span>{c.checkPoints}</span>
				</ScoreRow>
			))}
		</Container>
	);
};

const Container = styled.div`
	width: 200px;
	margin-right: 10px;
`;

const Title = styled.div`
	font-weight: bold;
`;

const ScoreRow = styled.div`
	display: flex;
	justify-content: space-between;
	border-radius: 5px;
	padding: 2px;
	margin: 5px 0;

	&:nth-child(2n + 1) {
		background-color: #e2e2e2;
	}
`;
