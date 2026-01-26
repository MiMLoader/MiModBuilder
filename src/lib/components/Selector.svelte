<script lang="ts">
import CheckIcon from "@lucide/svelte/icons/check";
import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
import { tick } from "svelte";
import { Button } from "$lib/components/ui/button/index.js";
import * as Command from "$lib/components/ui/command/index.js";
import * as Popover from "$lib/components/ui/popover/index.js";
import { cn } from "$lib/utils.js";

let {
	options,
	value = $bindable(),
	name,
}: {
	options: { value: string; label: string }[];
	value: string;
	name: string;
} = $props();

let open = $state(false);
let triggerRef = $state<HTMLButtonElement>(null!);

const selectedValue = $derived(options.find((f) => f.value === value)?.label);

function closeAndFocusTrigger() {
	open = false;
	tick().then(() => {
		triggerRef.focus();
	});
}
</script>


    <Popover.Root bind:open>
      <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="outline"
            class="w-[200px] justify-between"
            role="combobox"
            aria-expanded={open}
          >
            {selectedValue || "Default Value"}
            <ChevronsUpDownIcon class="opacity-50" />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Input placeholder="Search {name}..." />
          <Command.List>
            <Command.Empty>No {name} found.</Command.Empty>
            <Command.Group value="frameworks">
              {#each options as option (option.value)}
                <Command.Item
                  value={option.value}
                  onSelect={() => {
                    value = option.value;
                    closeAndFocusTrigger();
                  }}
                >
                  <CheckIcon
                    class={cn(value !== option.value && "text-transparent")}
                  />
                  {option.label}
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
