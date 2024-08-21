<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { Item } from '$lib/types';

	export let item: Item;
	if (item.mediaReplace === undefined) {
		item.mediaReplace = {
			capture: 'meow',
			replace: '',
		};
	}

	// biome-ignore lint/style/useConst: is bound to
	let capture = item.mediaReplace.capture;
</script>

<Input
	type="capture"
	placeholder="Capture"
	bind:value={capture}
	class="max-w-xs col-span-2"
/>
