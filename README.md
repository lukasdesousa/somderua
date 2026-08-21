# Som de Rua no Cloudflare Workers

Este projeto Next.js usa o adaptador OpenNext e o Wrangler para executar exclusivamente no Cloudflare Workers.

## Configuração do Workers Builds

No painel do Cloudflare, use exatamente:

- Build command: `pnpm run build`
- Deploy command: `pnpm run deploy:cloudflare`
- Root directory: `/`

O comando `pnpm run build` gera o build Next.js e o arquivo `.open-next/worker.js`. O comando interno `pnpm run build:next` existe somente para ser chamado pelo adaptador OpenNext.

O deploy command anterior, `npx wrangler deploy`, também funciona depois desta correção. O comando `pnpm run deploy:cloudflare` é recomendado porque usa o fluxo próprio do OpenNext.

## Desenvolvimento e deploy

Para testar no runtime do Cloudflare:

```bash
pnpm preview
```

Para fazer o build e publicar localmente:

```bash
pnpm deploy
```

Para somente gerar e enviar uma versão, sem ativá-la:

```bash
pnpm upload
```

Em Windows, o OpenNext recomenda executar esses comandos pelo WSL ou por um build conectado ao Git, pois a geração do diretório `standalone` usa links simbólicos.

## Variáveis de ambiente

No Cloudflare, copie as variáveis do ambiente de produção para **Build Variables and secrets**. As variáveis usadas em runtime também precisam estar disponíveis para o Worker, incluindo:

- `DATABASE_URL`
- `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` e `JWT_SECRET`
- `RESEND_API_KEY`, `ABANDONED_CART_FROM_EMAIL`, `ABANDONED_CART_REPLY_TO` e `ABANDONED_CART_API_SECRET`
- `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` e `R2_BUCKET`
- as variáveis públicas `NEXT_PUBLIC_*` usadas pelo site

Para cadastrar um segredo pela CLI:

```bash
pnpm wrangler secret put NOME_DA_VARIAVEL
```

O `DEPLOY_TARGET=cloudflare` já está definido em `wrangler.jsonc`.
