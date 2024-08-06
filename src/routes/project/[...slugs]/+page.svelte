<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { item } from '$lib/types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { editorStore, itemsStore, sidebarHiddenStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import ItemEditor from '$lib/components/ItemEditor.svelte';

	let projectExists = true;

	onMount(() => {
		if (
			localStorage.getItem(
				`project${window.location.href.split('/').at(-1)}` as string,
			) === null
		) {
			projectExists = false;
		}
		const titleEnd = document.title;
		document.title = `${window.location.href.split('/').at(-1)} | ${titleEnd}`;
	});

	editorStore.set(true);

	let items: item[] = [];
	let currentItem: item | undefined = items[0];
	itemsStore.subscribe((updatedItems: item[]) => {
		items = updatedItems;
	});

	const selectItem = (item: item) => {
		document.getElementById(item.name)?.classList.add('selected');
		currentItem = item;
		for (const otherItems of items) {
			if (otherItems.name === item.name) continue;
			document
				.getElementById(otherItems.name)
				?.classList.remove('selected');
		}
	};
	const deleteItem = (item: item) => {
		items = items.filter((i) => i.name !== item.name);
		itemsStore.set(items);
		selectItem(items[0]);
	};

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
							<button
								id={item.name}
								class="text-sm text-left w-[100%] rounded h-5 truncate"
								on:click={() => {
									selectItem(item);
								}}
							>
								{item.name}
							</button>
						</ContextMenu.Trigger>
						<ContextMenu.Content class="w-32">
							<ContextMenu.Item
								inset
								on:click={() => {
									deleteItem(item);
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
