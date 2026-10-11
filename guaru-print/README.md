# Guaru Print — website

Site da **Guaru Print**, gráfica rápida e comunicação visual em Guarujá/SP.
Projeto Next.js independente: ele fica nesta pasta (`guaru-print/`) e não interfere no site da J.A Odontologia, que está na raiz do repositório.

```bash
cd guaru-print
npm install
cp .env.example .env.local   # opcional: o site roda sem nenhuma variável
npm run dev                  # http://localhost:3000
```

| Comando             | O que faz                                    |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento                  |
| `npm run build`     | Build de produção                            |
| `npm run lint`      | ESLint (regras do Next + React Compiler)     |
| `npm run typecheck` | TypeScript sem emitir arquivos               |
| `npm test`          | Testes unitários (medidas, arquivos, busca)  |

## Tecnologias

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Three.js com React Three Fiber e Drei · Motion · Lenis · Lucide · React Hook Form + Zod · Supabase (opcional).

## O que o site tem

**Páginas:** Início, Serviços (catálogo e uma página por serviço), Portfólio, Orçamento, Simulador, Guia de impressão, Sobre, Contato, Política de privacidade e o painel `/admin`.

**Experiência visual**
- Hero "Da ideia à impressão": partículas CMY formam o letreiro 3D com reflexos de estúdio (Lightformers locais, sem HDR externo). A cena carrega depois do conteúdo e escolhe a qualidade conforme o aparelho. Em aparelhos fracos, com economia de dados ou sem WebGL, ela não carrega. Também para de renderizar quando sai da tela.
- Animações de scroll (GSAP ScrollTrigger): impressão CMYK em tempo real, adesivo sendo aplicado, fachada antes e depois, explosão CMYK em canvas 2D e galeria horizontal no desktop (rolagem nativa com snap no mobile).
- Cursor personalizado, botões magnéticos com efeito de "tinta", transição entre páginas em três passadas de cor e revelação de textos com SplitText.
- Tudo respeita `prefers-reduced-motion`: com movimento reduzido, cada seção já aparece no estado final.

**Ferramentas**
- **Orçamento inteligente** (`/orcamento`) em 5 etapas: produto, personalização (campos específicos de cada produto), arte, dados e resumo. Ao final abre o WhatsApp com a mensagem completa e um número de referência. Aceita vários produtos na mesma solicitação (lista salva no navegador). Não pede cadastro e não mostra preços.
- **Upload de arte:** valida o formato pelo conteúdo real do arquivo (não pela extensão), o tamanho (25 MB), a integridade (decodifica imagens e confere o fim do PDF) e recusa SVG com scripts. Mostra prévia e no celular pode usar a câmera.
- **Calculadora de medidas:** área por peça e total, conversões entre mm, cm e m, proporção e desenho em escala ao lado de uma pessoa ou de uma folha A4. O botão "Usar essas medidas no orçamento" preenche o formulário.
- **Simulador visual** em canvas: adesivo, banner, placa, fachada (com foto própria) e cavalete. Permite ajustar escala, posição e dimensões e salvar a prévia em PNG com o aviso de simulação.
- **Busca inteligente** (Ctrl/⌘ + K), assistente "Preciso de ajuda para escolher", antes e depois arrastável (mouse, toque e teclado), FAQ e botão flutuante do WhatsApp com mensagem conforme a página.

## Conteúdo e regras de honestidade

- Os dados base ficam em `src/content/` e as informações comerciais em `src/config/site.ts`.
- Só são usadas informações do perfil oficial: 7 anos, 20.000+ pedidos, envio para todo o Brasil, Guarujá - SP, WhatsApp e Instagram. Endereço, horário e e-mail ficam ocultos até serem preenchidos.
- **Projetos do portfólio são placeholders** com o selo "Exemplo ilustrativo". Não há clientes, depoimentos ou preços inventados.
- Respostas de FAQ que dependem da política da empresa (criação de arte, instalação) estão marcadas como `pending` e pedem confirmação pelo WhatsApp.
- As imagens são ilustrações vetoriais próprias (`src/components/ui/Illustration.tsx`), sem arquivos de terceiros. Fotos reais entram pelo painel.
- O logotipo é tipográfico (`src/components/ui/Logo.tsx`). Troque-o pelo vetor oficial quando ele estiver disponível.

## Variáveis de ambiente

Todas são opcionais. Veja `.env.example`.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL final (SEO, sitemap, Open Graph). Padrão: `https://www.guaruprint.com.br` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp no formato internacional. Padrão: `5513992095305` |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Medição. Só carrega depois do aceite no aviso de cookies |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Opcional. Enviada no upload direto para a URL assinada, caso o gateway exija |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente no servidor.** Banco, storage e painel |
| `QUOTE_FILE_LINK_DAYS` | Validade do link da arte enviado no WhatsApp (padrão 7, máximo 30) |
| `QUOTE_SIGNING_SECRET` | Opcional. Assina os tickets de upload (se ausente, usa `ADMIN_SESSION_SECRET`) |
| `ADMIN_PASSWORD` | Senha do painel (12+ caracteres). Sem ela, o painel fica bloqueado |
| `ADMIN_SESSION_SECRET` | 32+ caracteres aleatórios (`openssl rand -hex 32`) |

## Supabase (banco e arquivos)

Sem Supabase, o site funciona com os dados demonstrativos e o orçamento segue normalmente pelo WhatsApp: o cliente anexa a arte na própria conversa.

Para ativar:
1. Crie um projeto em supabase.com e rode `supabase/schema.sql` no SQL Editor. O script cria as tabelas e os buckets `quote-files` (privado) e `site-media` (público).
2. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
3. No painel, em cada seção, clique em **Importar para o banco** para começar a editar a partir dos dados demonstrativos.

Como o envio de arte funciona com o Supabase ativo:
- O servidor gera a referência e URLs de upload assinadas. O navegador envia o arquivo **direto ao bucket privado**, sem passar pelo servidor do site, o que evita o limite de 4,5 MB da Vercel.
- O registro final confere, por um ticket assinado (HMAC), que os arquivos pertencem àquela referência. Ele também baixa o início de cada arquivo para confirmar o tipo.
- A mensagem do WhatsApp recebe um **link assinado e temporário** da arte. Os arquivos nunca ficam públicos.
- Todas as tabelas têm RLS ativo e nenhuma política para `anon`: apenas o servidor (service role) acessa.

## Painel administrativo (`/admin`)

Protegido por senha (`ADMIN_PASSWORD`), com cookie httpOnly assinado e limite de tentativas. O acesso é verificado no `src/proxy.ts` e de novo em cada página e server action.

No painel é possível:
- ver as solicitações de orçamento, alterar o status e baixar as artes por links de 1 hora;
- cadastrar e editar serviços, projetos (com fotos, antes e depois e materiais) e perguntas frequentes;
- editar as informações comerciais: endereço, horário, e-mail e o texto da página Sobre.

Ao salvar, o site é revalidado na hora. A sessão fica isolada em `src/lib/admin/session.ts`, pronta para ser trocada por Supabase Auth.

## Preços (preparado, desativado)

O site não mostra preços. A tabela `price_rules` e o módulo `src/lib/quote/pricing.ts` já definem a estrutura (por m², unidade ou milheiro, com filtros por material). `estimate()` retorna `null` enquanto `PRICING_ENABLED` for `false`.

## Analytics

Eventos disparados (somente com consentimento e IDs configurados): `whatsapp_click`, `quote_start`, `quote_submit`, `form_submit`, `simulator_use`, `simulator_export`, `service_interaction`, `calculator_use`, `quote_list_add`, `search_use`, `assistant_complete`. Nenhum dado pessoal é enviado.

## SEO e acessibilidade

- Metadata e canonical por página, Open Graph gerado em `/opengraph-image`, `sitemap.xml`, `robots.txt` (bloqueia `/admin` e `/api`) e manifest.
- Dados estruturados: `LocalBusiness`, `Service`, `FAQPage` e `BreadcrumbList`.
- Um único `h1` por página, link "Pular para o conteúdo", foco visível, diálogos nativos (`<dialog>`), controles com teclado (antes e depois, simulador, busca), alvos de toque de 44 px ou mais e `aria-live` nos resultados.

## Estrutura

```
src/
  app/(site)/        páginas públicas (layout com header, footer, WhatsApp, busca)
  app/admin/         painel protegido + server actions
  app/api/quote/     upload assinado e registro de orçamentos
  components/        layout, sections, scroll (animações), three (hero 3D), tools, quote, admin, ui
  content/           dados base (serviços, projetos, FAQ, etapas)
  lib/               quote (produtos, mensagem, lista, preços), data (conteúdo), admin, supabase, units, files, search
supabase/schema.sql  tabelas, buckets e RLS
tests/               testes unitários (node --test)
```

Para adicionar um produto ou um campo ao orçamento, edite apenas `src/lib/quote/products.ts`. Formulário, validação, resumo, mensagem e API usam essa definição.
