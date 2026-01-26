FROM oven/bun AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

FROM oven/bun
WORKDIR /app
COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "./build" ]
