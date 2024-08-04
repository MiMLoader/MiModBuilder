<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const projects: string[] = JSON.parse(
		localStorage.getItem('projects') as string,
	);

	const selectProject = (project: string) => {
		document.getElementById(project)?.classList.add('selected');
		for (const otherProject of projects) {
			if (otherProject === project) continue;
			document.getElementById(otherProject)?.classList.remove('selected');
		}
	};
</script>

<Tabs.Root value="browser">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="browser">Browser</Tabs.Trigger>
		<Tabs.Trigger value="computer">Computer</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="browser">
		<Card.Root>
			<Card.Header>
				<Card.Description>
					Projects saved to browser storage
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<ScrollArea class="h-72 rounded-md border">
					<div class="p-4">
						{#each projects as project}
							<button
								id={project}
								class="text-sm text-center w-[100%] rounded h-8"
								on:click={() => {
									selectProject(project);
								}}
							>
								{project.replaceAll('-', ' ')}
							</button>
							<Separator class="my-2" />
						{/each}
					</div>
				</ScrollArea>
			</Card.Content>
			<Card.Footer>
				<Button>Open</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="computer">
		<Card.Root>
			<Card.Header>
				<Card.Description>Upload a project</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2"></Card.Content>
			<Card.Footer>
				<Button>Open</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>

<style>
	:global(.selected) {
		background-color: #ebcaca36;
	}
</style>
