<script lang="ts">
	import type { item as itemT } from '$lib/types';

	export let item: itemT;
</script>

<div class="ml-2">
	<h1>{item.name}</h1>
	<h2>{item.type}</h2>
</div>
