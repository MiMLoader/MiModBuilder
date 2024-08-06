import { writable, type Writable } from 'svelte/store';
import type { item } from './types';

export const editorStore = writable(false);
export const itemsStore: Writable<item[]> = writable([]);
export const sidebarHiddenStore = writable(false);