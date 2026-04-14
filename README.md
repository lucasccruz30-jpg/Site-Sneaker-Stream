# Sneaker Stream

Base full stack de e-commerce premium para tênis importados, construída com foco em conversão, credibilidade, desejo de compra e operação comercial.

## Stack

- Next.js 16 com App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL
- Prisma ORM
- Auth.js / NextAuth v5 beta com login por credenciais
- Zod
- React Hook Form
- Zustand para carrinho e wishlist persistentes
- Cloudinary preparado para upload
- Stripe/PIX preparados na camada de checkout

## Arquitetura

- `src/app`
  - Rotas públicas da loja, checkout, conta, institucionais, APIs e painel admin
- `src/components`
  - Layout, storefront, admin, providers e componentes reutilizáveis
- `src/hooks`
  - Estado client-side de carrinho e wishlist
- `src/lib`
  - Formatação, branding, validações, Prisma, pagamentos e storage
- `src/server`
  - Queries e actions com regras de negócio
- `prisma`
  - Schema, seed e migration inicial
- `public/brand`
  - Logo principal, favicon e branding substituíveis

## Estrutura de domínio

- Storefront premium com home comercial, catálogo filtrável, produto, carrinho, checkout, conta, pedidos, wishlist e páginas institucionais
- Admin com dashboard, gestão de produtos, categorias, marcas, estoque, pedidos, clientes, cupons, banners, avaliações, conteúdo e configurações
- SEO técnico com `metadata`, Open Graph, `robots.txt` e `sitemap.xml`
- Camada preparada para integrações reais de pagamento, upload e e-mail

## Modelagem de dados

O schema Prisma cobre:

- `User`, `Account`, `Session`, `VerificationToken`
- `Address`
- `Brand`
- `Category`
- `Size`
- `Product`, `ProductImage`, `ProductVariant`
- `Cart`, `CartItem`
- `WishlistItem`
- `Order`, `OrderItem`
- `Coupon`
- `Review`
- `Banner`
- `NewsletterSubscriber`
- `Settings`
- `ContentPage`

Também inclui:

- estoque por numeração
- status de pedido e pagamento
- preços promocionais
- slugs amigáveis
- índices para catálogo, pedidos e operação

## Páginas implementadas

### Públicas

- `/`
- `/shop`
- `/shop/[slug]`
- `/cart`
- `/checkout`
- `/checkout/success`
- `/login`
- `/cadastro`
- `/minha-conta`
- `/meus-pedidos`
- `/wishlist`
- `/sobre`
- `/contato`
- `/faq`
- `/politica-de-troca-e-devolucao`
- `/politica-de-entrega`
- `/politica-de-privacidade`
- `/termos-de-uso`
- `/autenticidade`
- `/drops`
- `404` customizado

### Admin

- `/admin`
- `/admin/produtos`
- `/admin/produtos/novo`
- `/admin/produtos/[id]`
- `/admin/categorias`
- `/admin/marcas`
- `/admin/estoque`
- `/admin/pedidos`
- `/admin/clientes`
- `/admin/cupons`
- `/admin/banners`
- `/admin/avaliacoes`
- `/admin/conteudo`
- `/admin/relatorios`
- `/admin/configuracoes`

## Componentes principais

- `SiteHeader`, `SiteFooter`, `BrandMark`
- `HomePageSections`, `ProductCard`, `CatalogSidebar`, `ProductDetail`
- `CartView`, `CheckoutView`, `WishlistView`
- `LoginForm`, `RegisterForm`, `ContactForm`, `NewsletterForm`, `ReviewForm`
- `AdminShell`, `RevenueChart`, `ProductAdminForm`
- `CategoryAdminForm`, `BrandAdminForm`, `CouponAdminForm`, `BannerAdminForm`, `ContentPageAdminForm`, `SettingsAdminForm`

## Setup local

1. Instale dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
copy .env.example .env
```

3. Configure um PostgreSQL local ou em nuvem e ajuste `DATABASE_URL`.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sneaker_stream?schema=public"
DATABASE_URL_UNPOOLED=""
AUTH_SECRET="gere-um-segredo-forte"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Aplique a migration:

```bash
npm run prisma:deploy
```

Para desenvolvimento com novas alterações de schema:

```bash
npm run prisma:migrate -- --name ajuste
```

5. Rode o seed inicial:

```bash
npm run db:seed
```

6. Inicie o projeto:

```bash
npm run dev
```

## Credenciais seed

- Admin
  - `admin@sneakerstream.com.br`
  - `Sneaker@123`
- Cliente
  - `cliente@sneakerstream.com.br`
  - `Cliente@123`

## Scripts úteis

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run db:seed
npm run vercel-build
npm run sync:now
npm run sync:now:dry
npm run setup:hooks
```

## Autossincronização

- O repositório pode sincronizar GitHub e Vercel automaticamente após cada `git commit`
- Em `main`, o hook faz `git push` e `vercel deploy --prod --yes`
- Em outras branches, o hook faz `git push` e `vercel deploy --yes` para preview
- O hook versionado fica em `.githooks/post-commit`
- O script central fica em `scripts/auto-sync.mjs`
- Para habilitar em uma nova máquina, rode:

```bash
npm run setup:hooks
```

- Para testar sem publicar nada:

```bash
npm run sync:now:dry
```

- Para desativar temporariamente em uma sessão PowerShell:

```powershell
$env:SNEAKER_STREAM_SKIP_AUTO_SYNC="1"
```

## Branding e identidade visual

### Logo e favicon

- Logo principal: `public/brand/logo-primary.png`
- Favicon: `public/brand/favicon.png`

Para trocar a identidade:

1. Substitua os arquivos em `public/brand`
2. Ajuste cores base em `src/app/globals.css`
3. Atualize metadados em `src/lib/site.ts`
4. Se quiser persistir branding pelo admin, use a página `/admin/configuracoes`

### Paleta aplicada

- Charcoal: `#575656`
- Preto profundo: `#131313`
- Bordô: `#550D1A`
- Off-white: `#FEFDFC`
- Cinza quente: `#95898A`
- Cinza claro: `#D4CACA`

## Upload de imagens

O projeto já possui rota e helpers para Cloudinary:

- `src/lib/cloudinary.ts`
- `src/app/api/upload/sign/route.ts`

Sem Cloudinary configurado, o admin continua funcional usando URLs manuais.

## Pagamentos

O checkout já contempla:

- cartão preparado para integração real
- PIX com código simulado e estrutura pronta para gateway
- cálculo de frete
- cupom
- persistência do pedido no banco

Lógica central:

- `src/lib/payments.ts`
- `src/server/actions/store.ts`

## SEO e performance

- Metadata centralizada
- Open Graph
- `robots.txt`
- `sitemap.xml`
- imagens otimizadas com `next/image`
- layouts e páginas dinâmicas preparadas para catálogo real

## Deploy

### GitHub

1. Crie um repositório vazio no GitHub
2. Adicione o remoto:

```bash
git remote add origin https://github.com/SEU-USUARIO/sneaker-stream.git
```

3. Envie a branch principal:

```bash
git push -u origin main
```

### Neon

1. Crie um projeto Postgres no Neon
2. Copie a string principal para `DATABASE_URL`
3. Se usar a integração Neon + Vercel, aproveite também `DATABASE_URL_UNPOOLED` para migrations
4. Rode localmente:

```bash
npm run prisma:deploy
npm run db:seed
```

### Vercel

1. Importe o repositório do GitHub no Vercel
2. Confirme o preset `Next.js`
3. Configure as variáveis do `.env.example`
4. Defina pelo menos:

```env
DATABASE_URL=""
DATABASE_URL_UNPOOLED=""
AUTH_SECRET=""
AUTH_URL="https://seu-dominio.vercel.app"
NEXT_PUBLIC_SITE_URL="https://seu-dominio.vercel.app"
```

5. O projeto já inclui `vercel.json` e o script `npm run vercel-build`
6. Esse build:
- gera o Prisma Client
- roda `prisma migrate deploy`
- usa `DATABASE_URL_UNPOOLED` automaticamente se ela existir
- finaliza com `next build`
7. Faça o primeiro deploy e, se quiser dados demo em produção, rode o seed apenas em um ambiente controlado

### Recomendação de ambiente

- Banco: Neon, Supabase ou PostgreSQL gerenciado
- Upload: Cloudinary
- Pagamento: Stripe ou gateway brasileiro
- E-mail: Resend

## Observações importantes

- A build está validada e concluída com sucesso
- O projeto está preparado para Vercel com Node `22.x`
- Sem banco rodando localmente, algumas rotas dinâmicas apenas logam tentativas de conexão durante o build, mas a compilação continua correta
- O contato está preparado via API local; se quiser persistir mensagens ou enviar e-mail transacional, a próxima etapa natural é adicionar um model de leads ou integração com Resend
