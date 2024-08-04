import { t } from 'elysia';
export const modSpecType = t.Object({
    name: t.String(),
    description: t.String(),
    author: t.String(),
    version: t.String(),
    homepage: t.String(),
    tags: t.ArrayString()
});


export interface Mod {
    name: string;
    description: string;
    author: string;
    version: string;
    homepage: string;
    preload: string | false;
    main: string;
    dependencies: string[];
    tags: string[];
    priority: number;
}