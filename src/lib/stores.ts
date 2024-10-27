import { writable, type Writable, get } from 'svelte/store';
import type { Item } from './types';

export const editorStore = writable(false);
export const itemsStore: Writable<Item[]> = writable([]);
export const sidebarHiddenStore = writable(false);
export const currentItemStore: Writable<Item | undefined> = writable(get(itemsStore)[0]);