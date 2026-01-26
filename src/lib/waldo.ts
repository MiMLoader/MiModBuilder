import type { CardJson } from "@mimloader/waldo";
import FileSaver from "file-saver";
import JSZip from "jszip";
import { get } from "svelte/store";
import { toast } from "svelte-sonner";
import { cardsStore, modJsonStore } from "./utils";

export const newCard = (name?: string) => {
	const cards = get(cardsStore);
	cards.push({
		name: name || `New Card ${cards.length + 1}`,
	});
	cardsStore.set(cards);
};

export const getCard = (name: string) => {
	const cards = get(cardsStore);
	const cardIndex = cards.findIndex((card) => card.name === name);
	return { card: cards[cardIndex], cardIndex };
};

export const saveCard = (index: number, card: CardJson) => {
	const cards = get(cardsStore);
	cards.splice(index, 1);

	cards.push(card);
	cardsStore.set(cards);

	toast.success("Saved Card");
};

export const deleteCard = (index: number) => {
	const cards = get(cardsStore);
	cards.splice(index, 1);
	cardsStore.set(cards);

	toast.success("Deleted Card");
};

export const cardJsonToWaldo = (index: number) => {
	const card = get(cardsStore)[index];
	const prettierCode = JSON.stringify(card)
		.replaceAll(",", ",\n    ")
		.replaceAll("{", "{\n    ")
		.replaceAll("}", "\n}");

	const waldoCode = `// Built with MiModBuilder | https://builder.mimloader.com

import { Card } from "@mimloader/waldo";

export default new Card(${prettierCode});
`;
	return waldoCode;
};

export const exportProject = () => {
	const zip = new JSZip();
	zip.file("mod.json", JSON.stringify(get(modJsonStore)));

	let waldo = zip.folder("waldo");

	const cards = get(cardsStore);
	for (let index = 0; index < cards.length; index++) {
		waldo.file(`${cards[index].name}.js`, cardJsonToWaldo(index));
	}
	zip.generateAsync({ type: "blob" }).then((content) => {
		FileSaver.saveAs(content, `${get(modJsonStore).name}.zip`);
	});
};
