<script lang="ts">
import CopyIcon from "@lucide/svelte/icons/copy";
import JsonIcon from "@lucide/svelte/icons/file-braces-corner";
import SaveIcon from "@lucide/svelte/icons/save";
import { toast } from "svelte-sonner";
import * as InputGroup from "$lib/components/ui/input-group/index.js";
import { Switch } from "$lib/components/ui/switch";
import { modJsonStore } from "$lib/utils";

const modJson = $state($modJsonStore);
let mainProp = $state(modJson.main || "");
let mainToggle = $state(!!modJson.main);

const save = () => {
	if (mainToggle) {
		modJson.main = mainProp;
	} else {
		modJson.main = false;
	}
	modJsonStore.set(modJson);
	toast.success("Saved mod.json", {
		icon: SaveIcon,
	});
};

const copy = () => {
	navigator.clipboard.writeText(JSON.stringify(modJson));
	toast("Copied to clipboard", {
		icon: CopyIcon,
	});
};
</script>

<div class="grid w-full max-w-md gap-4">
    <InputGroup.Root>
        <InputGroup.Addon align="block-start" class="border-b">
            <InputGroup.Text class="font-mono font-medium">
                <JsonIcon />
                mod.json
            </InputGroup.Text>
            <InputGroup.Button
                onclick={copy}
                class="ms-auto"
                variant="ghost"
                size="icon-xs"
            >
                <CopyIcon />
            </InputGroup.Button>
        </InputGroup.Addon>
        <div class="flex flex-row w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Name</InputGroup.Text
            >
            <InputGroup.Input
                placeholder="Cool Mod"
                bind:value={modJson.name}
            />
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Description</InputGroup.Text
            >
            <InputGroup.Input
                placeholder="Cool Description for Cool Mod"
                bind:value={modJson.description}
            />
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Author</InputGroup.Text
            >
            <InputGroup.Input placeholder="Me" bind:value={modJson.author} />
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Version</InputGroup.Text
            >
            <InputGroup.Input
                placeholder="0.0.1"
                bind:value={modJson.version}
            />
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Homepage</InputGroup.Text
            >
            <InputGroup.Input
                placeholder="https://github.com/cool/mod"
                bind:value={modJson.homepage}
            />
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Waldo</InputGroup.Text
            >
            <InputGroup.Addon align="inline-end" class="pl-3"
                ><Switch bind:checked={modJson.waldo} /></InputGroup.Addon
            >
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >Main</InputGroup.Text
            >
            {#if mainToggle}
                <InputGroup.Input placeholder="main.js" bind:value={mainProp} />
            {:else}
                <InputGroup.Input disabled />
            {/if}
            <InputGroup.Addon align="inline-end" class="pl-3"
                ><Switch bind:checked={mainToggle} /></InputGroup.Addon
            >
        </div>
        <div class="flex flex-row border-t w-full">
            <InputGroup.Text class="border-r min-w-23 justify-center"
                >priority</InputGroup.Text
            >
            <InputGroup.Input type="number" />
        </div>
        <InputGroup.Addon align="block-end" class="border-t">
            <InputGroup.Button
                onclick={save}
                size="sm"
                class="ms-auto"
                variant="default"
            >
                Save <SaveIcon />
            </InputGroup.Button>
        </InputGroup.Addon>
    </InputGroup.Root>
</div>
