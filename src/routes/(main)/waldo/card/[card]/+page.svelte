<script lang="ts">
import ChevronsUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
import CopyIcon from "@lucide/svelte/icons/copy";
import ExportIcon from "@lucide/svelte/icons/folder-input";
import SaveIcon from "@lucide/svelte/icons/save";
import Trash from "@lucide/svelte/icons/trash-2";
import { toast } from "svelte-sonner";
import { page } from "$app/state";
import CardDoesntExist from "$lib/components/CardDoesntExist.svelte";
import Selector from "$lib/components/Selector.svelte";
import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import * as Collapsible from "$lib/components/ui/collapsible/index.js";
import * as Field from "$lib/components/ui/field/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Textarea } from "$lib/components/ui/textarea/index.js";
import { elements, gfx, targets } from "$lib/dataArrays";
import { cardExists } from "$lib/utils";
import { cardJsonToWaldo, deleteCard, getCard, saveCard } from "$lib/waldo";

// if the card param is false it will fail to the parent folder anyway, this statement is just for type coercion
if (!page.params.card) {
	location.pathname = "/waldo/card";
	throw "";
}

const { card, cardIndex } = $state(getCard(page.params.card));
let displayName = $state(card?.EN?.split("{desc}")[0] || "");
let description = $state(card?.EN?.split("{desc}")[1] || "");
let damageType = $state(card?.damage?.split("*")[0] || "");
let damageMultiplier = $state(Number(card?.damage?.split("*")[1]) || 0);

let upgradeable: "" | "true" | "false" = $state(
	card?.upgradeable === undefined ? "" : card?.upgradeable ? "true" : "false",
);
let AI = $state(card?.AI === undefined ? "" : card?.AI ? "true" : "false");
let exhaust = $state(
	card?.exhaust === undefined ? "" : card?.exhaust ? "true" : "false",
);
let retain = $state(
	card?.retain === undefined ? "" : card?.retain ? "true" : "false",
);

let exportDialog: false | string = $state(false);
const exportCard = () => {
	exportDialog = cardJsonToWaldo(cardIndex);
};

const copy = () => {
	navigator.clipboard.writeText(exportDialog);
	toast("Copied to clipboard", {
		icon: CopyIcon,
	});
};

const save = () => {
	const cardJson = card;
	if (displayName || description) {
		card.EN = `${displayName}{desc}${description}`;
	}

	if (damageType) {
		card.damage = damageMultiplier
			? `${damageType}*${damageMultiplier}`
			: damageType;
	}

	// need to refactor
	if (upgradeable === "true") {
		console.log(upgradeable);
	} else if (upgradeable === "false") {
		card.upgradeable = false;
	}
	if (AI === "true") {
		card.AI = true;
	} else if (AI === "false") {
		card.AI = false;
	}
	if (exhaust === "true") {
		card.exhaust = true;
	} else if (exhaust === "false") {
		card.exhaust = false;
	}
	if (retain === "true") {
		card.retain = true;
	} else if (retain === "false") {
		card.retain = false;
	}

	saveCard(cardIndex, card);
};
</script>

<AlertDialog.Root open={!!exportDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{card.name}</AlertDialog.Title>
        <Textarea class="h-[50vh]" value={exportDialog}></Textarea>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={() => exportDialog = false}>Close</AlertDialog.Cancel>
      <AlertDialog.Action onclick={copy}>Copy <CopyIcon/></AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

{#if cardExists(page.params.card)}
    <Card.Root>
        <Card.Content>
        <form>
            <Field.Group>
            <Field.Set>
                <Field.Legend>{card.name.slice(0, 1).toLocaleUpperCase()+card.name.slice(1)} Card</Field.Legend>
                <Field.Group>
                <Field.Field>
                    <Field.Label for="card-name"
                    >Card Name</Field.Label
                    >
                    <Input
                    id="card-name"
                    bind:value={card.name}
                    placeholder="Bash"
                    required
                    />
                </Field.Field>
                <div class="grid grid-cols-4 gap-4">
                    <Field.Field>
                        <Field.Label for="card-type">Type</Field.Label>
                        <Input id="card-type" placeholder="Skill" bind:value={card.type}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-stat">Stat</Field.Label>
                        <Input id="card-stat" placeholder="speed" bind:value={card.stat} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-multiplier">Multiplier</Field.Label>
                        <Input id="card-multiplier" type="number" placeholder=0.5 bind:value={card.multiplier} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-element">Element</Field.Label>
                        <Selector id="card-element" name="Element" bind:value={card.element} options={elements}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-target">Target</Field.Label>
                        <Selector id="card-target" name="Target" bind:value={card.target} options={targets}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-cost">Cost</Field.Label>
                        <Input id="card-cost" type="number" placeholder=1 bind:value={card.playerCost} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-rarity">Rarity</Field.Label>
                        <Input id="card-rarity" type="number" placeholder=1 bind:value={card.rarity} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-damageType">Damage Type</Field.Label>
                        <Selector id="card-damageType" name="damage" bind:value={damageType} options={elements}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-damageMultiplier">Damage Multiplier</Field.Label>
                        <Input id="card-damageMultiplier" type="number" placeholder=0 bind:value={damageMultiplier} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-condition">Condition</Field.Label>
                        <Input id="card-condition" placeholder="Rage:2" bind:value={card.condition} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-upgradeable">Upgradeable</Field.Label>
                        <Selector id="card-upgradeable" name="Upgradeable" bind:value={upgradeable} options={[{label: "Default Value", value: ""}, {label: "True", value: "true"}, {label: "False", value: "false"}]}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-AI">AI</Field.Label>
                        <Selector id="card-AI" name="AI" bind:value={AI} options={[{label: "Default Value", value: ""}, {label: "True", value: "true"}, {label: "False", value: "false"}]}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-weight">Weight</Field.Label>
                        <Input id="card-weight" type="number" placeholder=1 bind:value={card.weight} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-exhaust">Exhaust</Field.Label>
                        <Selector id="card-exhaust" name="Exhaust" bind:value={exhaust} options={[{label: "Default Value", value: ""}, {label: "True", value: "true"}, {label: "False", value: "false"}]}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-retain">Retain</Field.Label>
                        <Selector id="card-retain" name="Retain" bind:value={retain} options={[{label: "Default Value", value: ""}, {label: "True", value: "true"}, {label: "False", value: "false"}]}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-armor">Armor</Field.Label>
                        <Input id="card-armor" type="number" placeholder=1 bind:value={card.armor} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-gfx">Gfx</Field.Label>
                        <Selector id="card-gfx" name="gfx" bind:value={card.gfx} options={gfx}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-draw">Draw</Field.Label>
                        <Input id="card-draw" bind:value={card.draw} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-energyGain">Energy Gain</Field.Label>
                        <Input id="card-energyGain" type="number" placeholder=0 bind:value={card.energyGain} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-displayName">Display Name</Field.Label>
                        <Input id="card-displayName" placeholder="Bash" bind:value={displayName}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-description">Description</Field.Label>
                        <Input id="card-description" placeholder="Reduce target's Armor by &#123dmg&#125." bind:value={description}/>
                    </Field.Field>
                </div>
                </Field.Group>
            </Field.Set>
            <Field.Separator />
            <Field.Set>
                <Collapsible.Root>
                 <Collapsible.Trigger>
                     <div class="flex items-center justify-between space-x-4 px-4">
                         <h4 class="text-sm font-semibold">Languages</h4>
                         <Button variant="ghost">
                           <ChevronsUpDownIcon />
                           <span class="sr-only">Toggle</span>
                         </Button>
                       </div>
                 </Collapsible.Trigger>
                 <Collapsible.Content>
                <Field.Group>
                    <Field.Field>
                        <Field.Label for="card-FR">French</Field.Label>
                        <Input id="card-FR" placeholder="Impact&#123desc&#125Réduit l'armure de la cible de &#123dmg&#125." bind:value={card.FR}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-DE">German</Field.Label>
                        <Input id="card-DE" placeholder="Hieb&#123desc&#125Senke die Rüstung des Ziels um &#123dmg&#125." bind:value={card.DE}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-ES">Spanish</Field.Label>
                        <Input id="card-ES" placeholder="Aporrear&#123desc&#125Reduce &#123dmg&#125 punto(s) la Armadura del objetivo." bind:value={card.ES}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-BR">Brazilian Portuguese</Field.Label>
                        <Input id="card-BR" placeholder="Golpear&#123desc&#125Reduz a Armadura do alvo em &#123dmg&#125." bind:value={card.BR}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-CN">Chinese</Field.Label>
                        <Input id="card-CN" placeholder="猛击&#123desc&#125使目标的防御降低&#123dmg&#125。" bind:value={card.CN}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-JP">Japanese</Field.Label>
                        <Input id="card-JP" placeholder="なぐる&#123desc&#125ターゲットのアーマーを&#123dmg&#125減らす。" bind:value={card.JP}/>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="card-RU">Russian</Field.Label>
                        <Input id="card-RU" placeholder="Таран&#123desc&#125Снимает &#123dmg&#125 брони" bind:value={card.RU}/>
                    </Field.Field>
                </Field.Group>
                 </Collapsible.Content>
                </Collapsible.Root>
                </Field.Set>
                <Field.Separator />
            <Field.Field class="flex flex-row justify-between" orientation="responsive">
                <Button variant="destructive" class="" onclick={() => {deleteCard(cardIndex); location.pathname = '/'}}>Delete <Trash/></Button>
                <div>
                    <Button onclick={exportCard}>Export <ExportIcon /></Button>
                    <Button onclick={save}>Save <SaveIcon /></Button>
                </div>
            </Field.Field>
            </Field.Group>
        </form>
        </Card.Content>
        <Card.Footer>
                <Button variant="link" target="_blank" href="https://docs.mimloader.com/docs/guide-waldo/cards">Card Documentation</Button>
        </Card.Footer>
    </Card.Root>
{:else}
    <CardDoesntExist/>
{/if}
