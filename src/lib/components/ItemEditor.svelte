<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { writeItems, selectItem } from '$lib/item';
	import type { Item as itemT, types as typesT } from '$lib/types';
	import { cn } from '$lib/utils.js';
	import { Pencil } from 'lucide-svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import MediaReplacer from './itemEditors/MediaReplacer.svelte';
	import { itemsStore } from '$lib/stores';
	import { get } from 'svelte/store';

	export let item: itemT;
	const ogItem = item;

	const types = [
		{
			value: 'none',
			label: 'None',
		},
		{
			value: 'mediaReplace',
			label: 'Media Replace',
		},
		{
			value: 'jsonReplace',
			label: 'Json Replace',
		},
	];

	let open = false;
	// biome-ignore lint/style/useConst: is bound to
	let typeValue: typesT = item.type;
	// biome-ignore lint/style/useConst: is bound to
	let nameValue = item.name;

	$: selectedValue =
		types.find((f) => f.value === typeValue)?.label ??
		types.find((f) => f.value === item.type)?.label;

	const closeAndFocusTrigger = (triggerId: string) => {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	};

	let editInfoRender = false;
	const editInfoView = () => {
		editInfoRender = true;
	};

	const saveItem = () => {
		item = {
			name: nameValue,
			type: typeValue,
			props: item.props,
		};

		const currentItemsStore = get(itemsStore);
		for (let i = 0; i < currentItemsStore.length; i++) {
			if (ogItem !== currentItemsStore[i]) continue;
			currentItemsStore[i] = item;
			itemsStore.set(currentItemsStore);
			
			writeItems(window.location.href.split('/').at(-1));
			editInfoRender = false;
			selectItem(item);
		}

	};
</script>

<div class="ml-2">
	<Button
		on:click={editInfoView}
		class="absolute right-5 mt-4"
		variant="outline"
		size="icon"
	>
		<Pencil class="h-4 w-4" />
	</Button>
	{#if item.type === 'mediaReplace'}
		<MediaReplacer {item} />
	{:else}
		<p>Type has no props.</p>
	{/if}
</div>

<Dialog.Root
	preventScroll
	closeOnOutsideClick={false}
	bind:open={editInfoRender}
>
	<Dialog.Content class="sm:max-w-[425px] grid grid-cols-2 gap-4">
		<Input
			type="name"
			placeholder="Name"
			bind:value={nameValue}
			class="max-w-xs col-span-2"
		/>
		<Popover.Root bind:open let:ids>
			<Popover.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="justify-between"
				>
					{selectedValue}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input placeholder="Search type..." />
					<Command.Empty>No type found.</Command.Empty>
					<Command.Group>
						{#each types as type}
							<Command.Item
								value={type.value}
								onSelect={(currentValue) => {
									// @ts-ignore reason: it is the correct type
									typeValue = currentValue;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								<Check
									class={cn(
										'mr-2 h-4 w-4',
										typeValue !== type.value &&
											'text-transparent',
									)}
								/>
								{type.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Button on:click={saveItem}>Save</Button>
	</Dialog.Content>
</Dialog.Root>
