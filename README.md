# Som de Rua

O mesmo projeto Next.js pode ser publicado na Vercel ou no Cloudflare Workers. A Vercel usa o build padrão do Next.js; o Cloudflare usa o adaptador OpenNext e o Wrangler.

## Vercel

- Build command: `pnpm build`
- Framework preset: Next.js
- Configure no projeto da Vercel as mesmas variáveis presentes no `.env` local.

## Cloudflare Workers

Para testar no runtime do Cloudflare:

```bash
pnpm preview
```

Para publicar com o Wrangler:

```bash
pnpm deploy
```

Para somente gerar e enviar uma versão, sem ativá-la:

```bash
pnpm upload
```

Em Windows, o OpenNext recomenda executar esses comandos pelo WSL ou por um build conectado ao Git, pois a geração do diretório `standalone` usa links simbólicos. O build padrão da Vercel pode continuar sendo executado diretamente no Windows.

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

O `DEPLOY_TARGET=cloudflare` já está definido em `wrangler.jsonc` e não deve ser configurado na Vercel.
