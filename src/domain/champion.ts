import { NetworkJson } from "neat/lib/neural-network/model/network";

export interface Champion {
	brain: NetworkJson;
	decisionFunction: string;
	activationFunction: string;
	name: string;
}
