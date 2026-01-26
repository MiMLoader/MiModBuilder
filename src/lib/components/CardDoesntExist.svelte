<script lang="ts">
import CardIcon from "@lucide/svelte/icons/book-copy";
import { page } from "$app/state";
import { Button } from "$lib/components/ui/button/index.js";
import * as Empty from "$lib/components/ui/empty/index.js";
import { newCard } from "$lib/waldo";
</script>

<Empty.Root class="h-full">
 <Empty.Header>
  <Empty.Media variant="icon">
   <CardIcon />
  </Empty.Media>
  <Empty.Title>Card Not Found</Empty.Title>
  <Empty.Description>
   The card {page.params.card} doesn't exist.
  </Empty.Description>
 </Empty.Header>
 {#if page.params.card}
 <Empty.Content>
  <Button  onclick={() => {newCard(page.params.card); location.reload()}} variant="outline" size="sm">Create {page.params.card}</Button>
 </Empty.Content>
 {/if}
</Empty.Root>
