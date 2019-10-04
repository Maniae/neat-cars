import { List, Map } from "immutable";
import { Candidate, Network, Population } from "neat";
import { START_X, START_Y } from "../core/constants";
import { Game } from "../core/game";
import { Car } from "../domain/car";
import { CarService } from "./carService";

const POPULATION_SIZE = 100;
const MUTATION_PROBABILITY = 0.6;
const NETWORK_SHAPE = [4, 4, 4, 2];
const MAX_FRAMES = 625; // ~10 seconds

export class PopulationService {
	generation: number;
	age: number;
	population: Population<number>;

	/* Cette Map est immutable - pour changer sa valeur : this.candidateCars = this.candidateCars.set(...)  */
	candidateCars: Map<Candidate<number>, Car> = Map();

	activationFunction(x: number): number {
		/***********************************************
		 * FONCTION D'ACTIVATION DU RÉSEAU DE NEURONES *
		 ***********************************************/
		return x;
	}

	fitness(candidate: Candidate<number>): number {
		/**************************************************
		 * FONCTION DE FITNESS DE L'ALGORITHME GÉNÉTIQUE. *
		 *         ASSOCIE UN SCORE À UN CANDIDAT         *
		 **************************************************/
		return 0;
	}

	mutate(genes: number[]): number[] {
		/***************************************************
		 * FONCTION DE MUTATION DE L'ALGORITHME GÉNÉTIQUE. *
		 *     RETOURNE UNE VERSION MUTÉE DU GÉNOME        *
		 ***************************************************/
		return [...genes];
	}

	/**********************************************
	 * NE RIEN MODIFIER EN DESSOUS DE CETTE LIGNE *
	 **********************************************/

	constructor(private game: Game, private carService: CarService) {
		this.generation = 0;
		this.age = 0;

		this.population = Population.generatePopulation(POPULATION_SIZE, () => this.generateGenes(), {
			fitness: c => this.fitness(c),
			mutate: genes => this.mutate(genes),
			mutationProbability: MUTATION_PROBABILITY,
		});

		this.candidateCars = this.generateCarsFromPopulation();
		this.game.onUpdate.add(() => this.checkTime());
		this.startRace();
	}

	generateCarsFromPopulation(): Map<Candidate<number>, Car> {
		return Map(
			this.population.candidates.map(c => {
				const { weights, biases } = this.getWeightAndBiasesFromGenes(c.genes);
				return [
					c,
					new Car(START_X, START_Y, Network.fromWeights(weights, biases, NETWORK_SHAPE, this.activationFunction)),
				];
			})
		);
	}

	generateGenes(): number[] {
		const network = Network.randomized(NETWORK_SHAPE, this.activationFunction);
		return [...network.weights, ...network.biases];
	}

	getWeightAndBiasesFromGenes(genes: number[]) {
		const neuronNumber = this.getNeuronNumber();
		const weightNumber = genes.length - neuronNumber;

		const [weights, biases] = [genes.slice(0, weightNumber), genes.slice(weightNumber)];
		return { weights, biases };
	}

	getNeuronNumber() {
		return NETWORK_SHAPE.reduce((acc, size) => acc + size, 0);
	}

	checkTime() {
		this.age++;
		if (this.age > MAX_FRAMES && this.carService.racing) {
			this.restartRace();
		}
	}

	restartRace() {
		this.stopRace();

		this.population = this.population.createNextGeneration();
		this.candidateCars = this.generateCarsFromPopulation();

		this.startRace();
	}

	startRace() {
		this.age = 0;
		this.carService.startRace(List(this.candidateCars.values()));
	}

	stopRace() {
		this.carService.stopRace();
	}

	getBestCar() {
		return this.candidateCars.get(this.population.bestCandidate);
	}
}
