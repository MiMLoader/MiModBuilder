<script lang="ts">
	import '../app.css';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { toggleMode, ModeWatcher, mode } from 'mode-watcher';
	import OpenProject from '$lib/components/OpenProject.svelte';
	import NewProject from '$lib/components/NewProject.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { editorStore, itemsStore } from '$lib/stores';
	import { get } from 'svelte/store';
	import hotkeys from 'hotkeys-js';
	import { toast } from 'svelte-sonner';
	import downloadSpec from '$lib/downloadSpec';

	let editor: boolean;

	const newItem = (name?: string) => {
		umami.track('items created');
		const currItemStore = get(itemsStore);
		name = `New Item ${(crypto.randomUUID().split('-').at(-1) as string) + currItemStore.length}`;
		itemsStore.update((v) => {
			return (v = [...v, { name, type: 'none' }]);
		});
	};

	editorStore.subscribe((value) => {
		editor = value;
	});

	onMount(() => {
		if (localStorage.getItem('projects') === null) {
			localStorage.setItem('projects', JSON.stringify([]));
		}

		hotkeys('shift+o', () => {
			openProjectView();
		});
		if (editor) {
			hotkeys('shift+g', () => {
				toast.info('were still working on this :/');
			});
			hotkeys('shift+s', () => {
				downloadSpec(window.location.href.split('/').at(-1) as string);
			});
			hotkeys('shift+n', () => {
				newItem();
			});
		}
	});

	let openProjectRender = false;
	const openProjectView = () => {
		openProjectRender = true;
	};

	let newProjectRender = false;
	const newProjectView = () => {
		umami.track('projects created');
		newProjectRender = true;
	};

	let darkMode: boolean;
	mode.subscribe((mode) => {
		if (mode === 'dark') {
			darkMode = true;
			return;
		}
		darkMode = false;
	});
</script>

<ModeWatcher />

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item on:click={newProjectView}>New Project</Menubar.Item>
			<Menubar.Item on:click={openProjectView}
				>Open Project
				<Menubar.Shortcut>⇧O</Menubar.Shortcut></Menubar.Item
			>
			{#if editor}
				<Menubar.Separator />
				<Menubar.Item>
					Export Project <Menubar.Shortcut>⇧G</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						downloadSpec(window.location.href.split('/').at(-1));
					}}
				>
					Save Project to Disk <Menubar.Shortcut>⇧S</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					on:click={() => {
						newItem();
					}}
				>
					New Item <Menubar.Shortcut>⇧N</Menubar.Shortcut>
				</Menubar.Item>
			{/if}
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item disabled>
				Undo <Menubar.Shortcut>^Z</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item disabled>
				Redo <Menubar.Shortcut>^⇧Z</Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.CheckboxItem bind:checked={darkMode} on:click={toggleMode}
				>Dark Mode</Menubar.CheckboxItem
			>
			<Menubar.Separator />
			<Menubar.Item inset>Hide Sidebar</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

<Toaster />

<Dialog.Root preventScroll bind:open={openProjectRender}>
	<Dialog.Content class="sm:max-w-[425px]">
		<OpenProject />
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root preventScroll bind:open={newProjectRender}>
	<Dialog.Content class="sm:max-w-[425px]">
		<NewProject />
	</Dialog.Content>
</Dialog.Root>

<slot></slot>
