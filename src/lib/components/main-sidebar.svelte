<script lang="ts">
import ConfigIcon from "@lucide/svelte/icons/bolt";
import CardIcon from "@lucide/svelte/icons/book-copy";
import ExportIcon from "@lucide/svelte/icons/folder-input";
import PlusIcon from "@lucide/svelte/icons/plus";
import type { CardJson } from "@mimloader/waldo";
import * as Sidebar from "$lib/components/ui/sidebar/index.js";
import { cardsStore, modJsonStore } from "$lib/utils";
import { exportProject, newCard } from "$lib/waldo";

let cards: CardJson[] = $state([]);
cardsStore.subscribe((newCards) => {
	cards = newCards;
});
</script>

<Sidebar.Root>
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupLabel
                >{($modJsonStore as Mod).name}</Sidebar.GroupLabel
            >
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton>
                            {#snippet child({ props })}
                                <a href="/config" {...props}>
                                    <ConfigIcon />
                                    <span>Config</span>
                                </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                    <Sidebar.Group>
                        <Sidebar.GroupLabel><CardIcon class="mr-1"/> Cards</Sidebar.GroupLabel>
                        <Sidebar.GroupAction onclick={() => newCard()} title="Add Card">
                            <PlusIcon />
                            <span class="sr-only">Add Card</span>
                        </Sidebar.GroupAction>
                        <Sidebar.GroupContent>
                            {#each cards as card (card.name)}
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        {#snippet child({ props })}
                                            <a data-sveltekit-reload href={`/waldo/card/${card.name}`} {...props}>
                                                <span>{card.name}</span>
                                            </a>
                                        {/snippet}
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            {/each}
                        </Sidebar.GroupContent>
                    </Sidebar.Group>
                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
        <Sidebar.MenuItem>
            <Sidebar.MenuButton onclick={exportProject} variant="outline"
                ><ExportIcon />Export</Sidebar.MenuButton
            >
        </Sidebar.MenuItem>
    </Sidebar.Footer>
</Sidebar.Root>
