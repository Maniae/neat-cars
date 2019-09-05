import { NetworkJson } from "neat/lib/neural-network/model/network";

export interface Champion {
	brain: NetworkJson;
	decisionFunction: string;
	name: string;
}
