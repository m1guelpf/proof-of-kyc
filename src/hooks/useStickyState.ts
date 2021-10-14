import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useStickyState<S>(key: string, defaultValue: S): [S, Dispatch<SetStateAction<S>>] {
	const initValue = getFromLocalStorage(key, defaultValue)
	const [state, setState] = useState(initValue)

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(state))
	}, [state])

	return [state, setState]
}

const getFromLocalStorage = (key, defaultValue) => {
	if (typeof window === 'undefined') return defaultValue

	const retrievedValue = window.localStorage.getItem(key)

	if (retrievedValue) return JSON.parse(retrievedValue) ?? defaultValue

	return defaultValue
}
