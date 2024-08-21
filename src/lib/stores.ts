import { writable, type Writable } from 'svelte/store';
import type { Item } from './types';

export const editorStore = writable(false);
export const itemsStore: Writable<Item[]> = writable([]);
export const sidebarHiddenStore = writable(false);