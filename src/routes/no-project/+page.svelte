<script lang="ts">
    import "../layout.css";
    import FolderCodeIcon from "@lucide/svelte/icons/folder-code";
    import ErrorIcon from "@lucide/svelte/icons/octagon-alert";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import * as Empty from "$lib/components/ui/empty";
    import * as InputGroup from "$lib/components/ui/input-group";
    import * as Item from "$lib/components/ui/item";
    import { modJsonStore } from "$lib/utils";

    const data = $state({
        name: "",
        author: "",
    });
    let validationError = $state("");
    let validateOnInput = false;

    const validate = () => {
        validationError = "";

        if (data.name.length < 1) {
            validationError = "Name has to be longer than one.";
            return false;
        }
        if (!/^[a-zA-Z0-9]/.test(data.name)) {
            validationError = "Name cannot start with a symbol or space.";
            return false;
        }
        if (data.author.length < 1) {
            validationError = "Author has to be longer than one.";
            return false;
        }
        return true;
    };

    const onInput = () => {
        if (validateOnInput) validate();
    };

    const createProject = () => {
        validateOnInput = true;
        if (validate()) {
            modJsonStore.set({
                name: data.name,
                author: data.author,
                waldo: true,
                main: false,
            });
            location.pathname = "/";
        }
    };
</script>

<Empty.Root>
    <Empty.Header>
        <Empty.Media variant="icon">
            <FolderCodeIcon />
        </Empty.Media>
        <Empty.Title>No Project</Empty.Title>
        <Empty.Description>
            You haven't loaded any projects yet.
        </Empty.Description>
    </Empty.Header>
    <Empty.Content>
        <div class="flex gap-2">
            <AlertDialog.Root>
                <AlertDialog.Trigger
                    ><Button>Create Project</Button></AlertDialog.Trigger
                >
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>New Mod</AlertDialog.Title>
                        <InputGroup.Root>
                            <InputGroup.Addon>
                                <InputGroup.Text>Name</InputGroup.Text>
                            </InputGroup.Addon>
                            <InputGroup.Input
                                placeholder="Cool Mod"
                                bind:value={data.name}
                                oninput={onInput}
                            />
                        </InputGroup.Root>
                        <InputGroup.Root>
                            <InputGroup.Addon>
                                <InputGroup.Text>Author</InputGroup.Text>
                            </InputGroup.Addon>
                            <InputGroup.Input
                                placeholder="Me"
                                bind:value={data.author}
                                oninput={onInput}
                            />
                        </InputGroup.Root>
                        {#if validationError}
                            <Item.Root variant="outline" size="sm">
                                <Item.Media>
                                    <ErrorIcon class="size-5 text-red-400" />
                                </Item.Media>
                                <Item.Content>
                                    <Item.Title class="text-red-300"
                                        >{validationError}</Item.Title
                                    >
                                </Item.Content>
                            </Item.Root>
                        {/if}
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action onclick={createProject}
                            >Continue</AlertDialog.Action
                        >
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <Button variant="outline" disabled>Import Project</Button>
        </div>
    </Empty.Content>
    <Button variant="link" class="text-muted-foreground" size="sm"></Button>
</Empty.Root>
