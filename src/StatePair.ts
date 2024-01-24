import React, { useState } from "react";

type StatePair<T> = {
	Value: T,
	Set: React.Dispatch<React.SetStateAction<T>>
}

function useStatePair<T>(def: T) {
	const [value, setter] = useState(def);
	const pair: StatePair<T> = {
		Value: value,
		Set: setter
	}

	return pair;
}

export { StatePair, useStatePair }