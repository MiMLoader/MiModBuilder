import { type Options, persistent } from "@furudean/svelte-persistent-store";
import type { CardJson } from "@mimloader/waldo";
import { type ClassValue, clsx } from "clsx";
import { get } from "svelte/store";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
	? Omit<T, "children">
	: T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};

export const cardExists = (name: string | undefined) => {
	if (!name) return false;
	const cards = get(cardsStore);
	const match = cards.filter((card) => card.name === name);
	if (match.length === 0) {
		return false;
	}
	return true;
};

export const modJsonStore = persistent<Mod>({
	key: "mod.json",
	storage_type: "localStorage",
	start_value: {},
});

export const cardsStore = persistent<CardJson[]>({
	key: "cards",
	storage_type: "localStorage",
	start_value: [],
});
