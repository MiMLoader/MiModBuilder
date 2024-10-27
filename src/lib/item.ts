import { itemsStore, currentItemStore } from '$lib/stores';
import { get } from 'svelte/store';
import type { Spec, Item } from './types';


export const newItem = (name?: string) => {
    umami.track('items created');
    name = `New Item ${(crypto.randomUUID().split('-').at(-1) as string)}`;
    itemsStore.update((v) => {
        // @ts-ignore value is correct
        return (v = [...v, { name, type: 'none', props: {} }]);
    });
    writeItems(window.location.href.split('/').at(-1));
};

export const writeItems = (project: string | undefined) => {
    const RawSpec = window.localStorage.getItem(`project${project}`);
    if (RawSpec === null) throw new Error(`couldn't find project "${project}"`);
    const spec: Spec = JSON.parse(RawSpec);
    spec.items = get(itemsStore);
    window.localStorage.setItem(`project${project}`, JSON.stringify(spec));
};
export const deleteItem = (item: Item) => {
    const items = get(itemsStore).filter((i) => i.name !== item.name);
    itemsStore.set(items);
    writeItems(window.location.href.split('/').at(-1));
};

export const selectItem = (item: Item) => {
    console.log(item, get(itemsStore), (get(itemsStore).includes(item)));
    const items: Item[] = get(itemsStore);
    currentItemStore.set(item);
    document.getElementById(item.name)?.classList.add('selected');
    for (const otherItem of items) {
        if (otherItem.name === item.name) continue;
        document
            .getElementById(otherItem.name)
            ?.classList.remove('selected');
    }
};