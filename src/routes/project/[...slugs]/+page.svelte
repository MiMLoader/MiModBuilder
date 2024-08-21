<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { Item, Spec } from '$lib/types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { editorStore, itemsStore, sidebarHiddenStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import ItemEditor from '$lib/components/ItemEditor.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { get } from 'svelte/store';
	import { deleteItem } from '$lib/item';

	let projectExists = true;

	onMount(() => {
		const projectName = window.location.href.split('/').at(-1);
		if (typeof projectName !== 'string') {
			projectExists = false;
			return;
		}
		if (localStorage.getItem(`project${projectName}`) === null) {
			projectExists = false;
		}
		const titleEnd = document.title;
		document.title = `${projectName} | ${titleEnd}`;

		const project = localStorage.getItem(`project${projectName}`);
		if (project !== null) {
			const spec: Spec = JSON.parse(project);
			if (spec.items.length > 0) {
				items = spec.items;
				itemsStore.set(items);
			}
		}
	});

	editorStore.set(true);

	let items: Item[] = get(itemsStore);
	let currentItem: Item | undefined = items[0];
	const selectItem = (item: Item) => {
		currentItem = item;
		document.getElementById(item.name)?.classList.add('selected');
		for (const otherItem of items) {
			if (otherItem.name === item.name) continue;
			document
				.getElementById(otherItem.name)
				?.classList.remove('selected');
		}
	};

	itemsStore.subscribe((updatedItems: Item[]) => {
		items = updatedItems;
	});

	let sidebarHidden: 'visible' | 'hidden' = 'visible';
	sidebarHiddenStore.subscribe((hidden) => {
		if (hidden) {
			sidebarHidden = 'hidden';
			return;
		}
		sidebarHidden = 'visible';
		return;
	});
</script>

{#if !projectExists}
	<AlertDialog.Root open>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Project not Found</AlertDialog.Title>
				<AlertDialog.Description>
					This project can't be found in your browsers storage, either
					make a new one or import it.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action
					on:click={() => {
						window.location.href = '/';
					}}>Ok</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}

<div class="flex flex-row">
	<div id="sidebar" class="w-32 {sidebarHidden}">
		<ScrollArea class="bottom-0 border-r h-[100%]">
			<div class="p-4">
				{#each items as item}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Button
										variant="ghost"
										id={item.name}
										class="text-sm text-left w-[100%] rounded h-5 truncate"
										on:click={() => {
											selectItem(item);
										}}
									>
										{item.name}
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{item.name}, {item.type}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</ContextMenu.Trigger>
						<ContextMenu.Content class="w-32">
							<ContextMenu.Item
								inset
								on:click={() => {
									deleteItem(item);
									currentItem = items[0];
								}}>Delete</ContextMenu.Item
							>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</div>
		</ScrollArea>
	</div>

	{#if currentItem !== undefined}
		<ItemEditor item={currentItem} />
	{/if}
</div>

<style>
	:global(.selected) {
		background-color: #ebcaca36;
	}

	#sidebar {
		height: calc(100vh - 40px);
	}
</style>
