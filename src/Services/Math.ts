function CollapsableRandomArray(
	min: number,
	max: number,
	exclude: Set<number>,
	numberOfResults: number = 1
): number[] {
	let possibleResults: number[] = [];

	for (let i = min; i <= max; i++) {
		if (!exclude.has(i)) {
			possibleResults.push(i);
		}
	}

	console.log(possibleResults);

	let output: number[] = [];

	for (let i = 0; i < numberOfResults; i++) {
		let rawResult: number = Math.floor(
			Math.random() * (possibleResults.length - 1)
		);
		output.push(possibleResults[rawResult]);
	}

	console.log(output);

	return output;
}

function ArrayRange(min: number, max: number): number[] {
	/*let output: number[] = [];

	for (let i = min; i <= max; i++) {
		output.push(i);
	}

	return output;*/
	return [...Array(max - min + 1).keys()].map((i) => i + min)
}

function AddRangeToSet(min: number, max: number, set: Set<number>): Set<number> {
	for (let i = min; i <= max; i++) {
		set.add(i);
	}

	return set;
}

export { CollapsableRandomArray, ArrayRange, AddRangeToSet };
