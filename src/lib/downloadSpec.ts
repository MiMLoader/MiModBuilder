import { toast } from 'svelte-sonner';

const downloadSpec = (project: string) => {
    toast.info(`Generating and downloading ${project}`);
    const projectSpec = localStorage.getItem(`project${project}`);
    if (projectSpec === null) return toast.error(`Couldn't find ${project}`);
    const downloadElement = document.createElement('a');
    downloadElement.href = URL.createObjectURL(new Blob([projectSpec], {
        type: "application/json"
    }));;
    downloadElement.setAttribute('download', `${project}.spec.json`);
    document.body.appendChild(downloadElement).click();
    document.body.removeChild(downloadElement);
    umami.track('spec saved');
};

export default downloadSpec;