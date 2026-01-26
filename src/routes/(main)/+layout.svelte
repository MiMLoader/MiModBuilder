<script lang="ts">
import "../layout.css";
import { onMount } from "svelte";
import MainSidebar from "$lib/components/main-sidebar.svelte";
import * as Sidebar from "$lib/components/ui/sidebar";
import { Toaster } from "$lib/components/ui/sonner/index.js";
import { modJsonStore } from "$lib/utils";

const { children } = $props();

onMount(() => {
	const modJson = $modJsonStore;

	if (!modJson.name) location.pathname = "/no-project";
});
</script>

<Toaster />

<Sidebar.Provider>
    <MainSidebar />
    <main class="w-full p-4">
        {@render children?.()}
    </main>
</Sidebar.Provider>
