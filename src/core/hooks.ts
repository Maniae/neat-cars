import { Signal } from "micro-signals";
import { useEffect, useState } from "react";

export function usePromise<T>(asyncTask: () => Promise<T>, ...deps: any[]) {
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState<T | null>(null);

	useEffect(() => {
		const awaitPromise = async () => {
			try {
				setLoading(true);
				setResult(await asyncTask());
			} catch (e) {
				console.error(e);
				setError(e);
			} finally {
				setLoading(false);
			}
		};
		awaitPromise();
	}, deps);

	return { error, loading, result };
}

export function useChangingValue<T>(initialValue: T, changeSignal: Signal<T>) {
	const [val, effect] = useState(initialValue);
	useSignal(changeSignal, effect);
	return val;
}

export function useSignal<T>(signal: Signal<T>, effect: (value: T) => void) {
	useEffect(() => {
		signal.add(effect);
		return () => signal.remove(effect);
	}, []);
}
