<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { Item } from '$lib/types';

	export let item: Item;
	// if (item.mediaReplace === undefined) {
	// 	item.mediaReplace = {
	// 		capture: 'meow',
	// 		replace: '',
	// 	};
	// }

	// biome-ignore lint/style/useConst: is bound to
	let capture = item.props.capture;
	// biome-ignore lint/style/useConst: is bound to
	let replace = item.props.replace;
</script>

<Input
	type="capture"
	placeholder="Capture"
	bind:value={capture}
	class="max-w-xs col-span-2"
/>
<Input
	type="replace"
	placeholder="Replace"
	bind:value={replace}
	class="max-w-xs col-span-2"
/>
