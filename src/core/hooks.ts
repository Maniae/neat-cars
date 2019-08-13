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
