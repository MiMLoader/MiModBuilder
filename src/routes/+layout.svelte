<script lang="ts">
	import '../app.css';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { toggleMode, ModeWatcher, mode } from 'mode-watcher';
	import OpenProject from '$lib/components/OpenProject.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';

	onMount(() => {
		if (localStorage.getItem('projects') === null) {
			localStorage.setItem('projects', JSON.stringify([]));
		}

		localStorage.setItem(
			'projects',
			JSON.stringify(['mimlAPI', 'Cool-mod-1', 'wow-EVEN-cooler']),
		);
	});

	let openProjectRender = false;
	const openProject = () => {
		openProjectRender = true;
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
			<Menubar.Item>New Project</Menubar.Item>
			<Menubar.Item on:click={openProject}
				>Open Project
				<Menubar.Shortcut>⇧O</Menubar.Shortcut></Menubar.Item
			>
			<Menubar.Separator />
			<Menubar.Item>
				Export Project <Menubar.Shortcut>⇧G</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>
				Save Project to Disk <Menubar.Shortcut>⇧S</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>
				New Item <Menubar.Shortcut>⇧N</Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				Undo <Menubar.Shortcut>^Z</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>
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

<Dialog.Root preventScroll bind:open={openProjectRender}>
	<Dialog.Content class="sm:max-w-[425px]">
		<OpenProject />
	</Dialog.Content>
</Dialog.Root>

<slot></slot>
