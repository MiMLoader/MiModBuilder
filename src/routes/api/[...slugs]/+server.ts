import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { modSpecType } from '$lib/types';

const specToModJson = (spec: typeof modSpecType.properties) => {

};

const app = new Elysia({ prefix: '/api' })
    .use(swagger({
        path: '/docs',
        documentation: {
            info: {
                title: 'MiMBuilder API Docs',
                version: '1.0.0'
            }
        }
    }))
    .get('/', () => 'meow')
    .post('/generateMod', ({ body }) => {

    }, {
        body: modSpecType
    });

type RequestHandler = (v: { request: Request; }) => Response | Promise<Response>;

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);