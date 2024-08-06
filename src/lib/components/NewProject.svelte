<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from './ui/label/label.svelte';
	import type { Spec } from '$lib/types';
	import { toast } from 'svelte-sonner';

	const reportInputError = (id: string, reason: string) => {
		const label = document.getElementById(id);
		if (label === null)
			throw new Error(`failed to get ${id} element via id`);
		label.innerText = reason;
	};

	const resetInputErrors = (...ids: string[]) => {
		for (const id of ids) {
			const element = document.getElementById(id);
			if (element === null)
				throw new Error(`failed to get ${id} element via id`);
			element.innerText = '';
		}
	};

	const validateInputs = () => {
		let failed = false;

		if (name.length < 1) {
			reportInputError('nameLabel', 'Longer than one');
			failed = true;
		}
		if (name?.includes(' ')) {
			reportInputError('nameLabel', 'Cannot have spaces');
			failed = true;
		}
		if (description.length < 1) {
			reportInputError('descriptionLabel', 'Longer than one');
			failed = true;
		}
		if (author.length < 1) {
			reportInputError('authorLabel', 'Longer than one');
			failed = true;
		}

		if (failed === true) return false;
		return true;
	};

	const createProject = () => {
		resetInputErrors('nameLabel', 'descriptionLabel', 'authorLabel');
		if (!validateInputs()) return;

		if (localStorage.getItem(`project${name}`) !== null)
			return toast.error('Already Exists', {
				description: 'A project under this name already exists',
			});

		const spec: Spec = {
			name,
			author,
			description,
		};

		localStorage.setItem(`project${name}`, JSON.stringify(spec));
		const rawProjects = localStorage.getItem('projects') as string;
		const projects = JSON.parse(rawProjects) as string[];
		projects.push(name);
		localStorage.setItem('projects', JSON.stringify(projects));

		window.location.href = `/project/${name}`;
	};

	// biome-ignore lint/style/useConst: is bound to
	let name = '';
	// biome-ignore lint/style/useConst: is bound to
	let description = '';
	// biome-ignore lint/style/useConst: is bound to
	let author = '';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>New Project</Card.Title>
	</Card.Header>
	<Card.Content class="grid grid-cols-2 gap-4">
		<div>
			<Input
				bind:value={name}
				type="text"
				id="name"
				placeholder="Name"
				class="max-w-xs"
			/>
			<Label class="text-red-500" id="nameLabel" for="name"></Label>
		</div>
		<div>
			<Input
				bind:value={author}
				type="text"
				id="author"
				placeholder="Author"
				class="max-w-xs"
			/>
			<Label class="text-red-500" id="authorLabel" for="author"></Label>
		</div>
		<div class="col-span-2">
			<Input
				bind:value={description}
				type="text"
				id="description"
				placeholder="Description"
			/>
			<Label class="text-red-500" id="descriptionLabel" for="description"
			></Label>
		</div>
	</Card.Content>
	<Card.Footer>
		<Button on:click={createProject} type="submit">Create</Button>
	</Card.Footer>
</Card.Root>
