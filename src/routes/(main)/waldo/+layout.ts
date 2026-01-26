import { get } from "svelte/store";
import { toast } from "svelte-sonner";
import { modJsonStore } from "$lib/utils";

export const load = () => {
	const modJson = get(modJsonStore);

	if (!modJson.waldo) {
		toast.warning("Waldo is not enabled.", {
			description:
				"Waldo is not enabled in the mod.json so non of these features will work.",
			action: {
				label: "Enabled Waldo",
				onClick: () => {
					modJson.waldo = true;
					modJsonStore.set(modJson);
					toast.success("Enabled Waldo");
				},
			},
		});
	}
};
