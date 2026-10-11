# J.A Odontologia Estética — Website

Site institucional e de captação de pacientes da **J.A Odontologia Estética** (Santos — SP).
Luxury minimalism, scroll cinematográfico e agendamento via WhatsApp.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · Motion · React Three Fiber (pontual) · Lucide.

---

## Como executar

Requisitos: Node.js 20+ (testado com Node 22).

```bash
npm install
cp .env.example .env.local   # preencha com os dados confirmados da clínica
npm run dev                  # http://localhost:3000
```

| Comando             | O que faz                       |
| ------------------- | ------------------------------- |
| `npm run dev`       | Ambiente de desenvolvimento     |
| `npm run build`     | Build de produção               |
| `npm run start`     | Servidor de produção (pós-build)|
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | Verificação de tipos            |

---

## Estrutura

```
src/
├─ app/                       Rotas (App Router)
│  ├─ page.tsx                Home (todas as seções)
│  ├─ tratamentos/[slug]/     Página própria de cada tratamento (SSG)
│  ├─ politica-de-privacidade/
│  ├─ api/contact/            Encaminha o formulário a um webhook (opcional)
│  ├─ sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg
│  └─ globals.css             Design system (cores, tipografia, utilitários)
├─ config/site.ts             ⚙️ Dados da clínica (lidos do .env)
├─ content/                   ✏️ Conteúdo editável
│  ├─ treatments.ts           Tratamentos (texto, benefícios, FAQ, foto, publicar/ocultar)
│  ├─ faq.ts                  Perguntas frequentes
│  ├─ gallery.ts              Galeria de resultados (vazia por padrão)
│  ├─ testimonials.ts         Depoimentos (vazio → seção oculta)
│  ├─ images.ts               Fotografias institucionais
│  ├─ about.ts · journey.ts
├─ components/
│  ├─ layout/                 Header, Footer, Lenis, animações de scroll, WhatsApp flutuante, consentimento, analytics
│  ├─ sections/               Hero, Sobre, Tratamentos, Manifesto, Galeria, CTA, Jornada, Depoimentos, FAQ, Contato
│  ├─ ui/                     Botões/CTAs, Media, arte provisória, acordeão, formulário, mapa
│  └─ three/                  Pérola 3D (carregada sob demanda)
└─ lib/                       whatsapp, analytics, consentimento, SEO/JSON-LD, validação do formulário
```

### Editando o conteúdo

O conteúdo fica em arquivos TypeScript tipados em `src/content/` — basta editar e publicar novamente. A estrutura já está separada da apresentação, então migrar para um CMS (Sanity, Contentful, Strapi…) no futuro significa trocar a origem desses dados, sem refazer os componentes.

- **Trocar uma foto:** coloque o arquivo em `public/images/` e preencha `src` (ex.: `"/images/hero.jpg"`) em `content/images.ts` ou no tratamento correspondente. Enquanto `src` for `null`, o site mostra uma **arte provisória** na identidade da marca, identificada com a etiqueta "Imagem provisória".
- **Ocultar um tratamento:** `published: false` em `content/treatments.ts` (some do site, do menu do rodapé, do formulário e do sitemap).
- **Galeria / depoimentos:** adicione itens em `content/gallery.ts` e `content/testimonials.ts`. A galeria ganha filtros por tratamento e visualização ampliada automaticamente; os depoimentos aparecem como carrossel acessível.

---

## Animações

Implementadas com GSAP/ScrollTrigger e aplicadas por atributos `data-*` (ver `components/layout/ScrollEffects.tsx`):

- Hero: logo e menu em fade, título palavra por palavra, foto revelada por máscara, botões com atraso, indicador de scroll, parallax.
- Text reveal por linhas (`data-reveal="lines"`), image reveal por máscara (`data-mask`), parallax (`data-parallax`).
- Scroll pinning + scroll horizontal na vitrine de tratamentos (desktop); cards verticais no mobile.
- Scale transition fixada na seção-manifesto.
- Transição de fundo entre seções off-white → bege → taupe (`data-tone`).
- Timeline da jornada do paciente com linha preenchida pelo scroll.
- Pérola 3D (Three.js) apenas em telas ≥ 768px, carregada sob demanda e pausada fora da tela; versão estática em CSS nos demais casos.
- Rodapé revelado como cortina.

Tudo respeita `prefers-reduced-motion`: nesse caso, nada é escondido nem animado e o Lenis é desligado. Navegação por teclado funciona inclusive dentro da seção horizontal.

---

## WhatsApp e formulário

- Todos os CTAs usam `src/lib/whatsapp.ts`.
- O número oficial **(13) 99741-2905** já está configurado em `src/config/site.ts` (pode ser trocado por `NEXT_PUBLIC_WHATSAPP_NUMBER`). Os botões abrem conversas com mensagem pré-preenchida:
  - geral: *"Olá! Conheci a J.A pelo site e gostaria de agendar uma avaliação."*
  - tratamento: *"Olá! Conheci a J.A Odontologia Estética pelo site e gostaria de saber mais sobre o procedimento de [TRATAMENTO]."*
- O formulário abre o WhatsApp com nome, telefone, tratamento de interesse e mensagem já preenchidos. (Se o número for removido da configuração, o site volta ao link do Instagram, que não aceita texto pré-preenchido — nesse caso o formulário copia a mensagem para a área de transferência.)
- **Formulário:** nome, telefone (com máscara), tratamento de interesse, mensagem opcional e consentimento LGPD obrigatório. Validação no cliente e no servidor. Por padrão, envia para o WhatsApp; se `CONTACT_WEBHOOK_URL` estiver definido, envia para `/api/contact`, que repassa ao webhook (Zapier, Make, n8n, CRM…). O site não armazena os dados. Há honeypot anti-spam.

---

## SEO, analytics e privacidade

- Metadados por página, Open Graph (imagem gerada automaticamente), `sitemap.xml`, `robots.txt`, canonical.
- JSON-LD: `Dentist` (só com dados configurados), `FAQPage`, `BreadcrumbList` e `MedicalProcedure` nas páginas de tratamento.
- Palavras-chave locais usadas naturalmente nos títulos das páginas pertinentes ("Clareamento Dental em Santos" etc.).
- **GA4 e Meta Pixel** só carregam após o visitante aceitar o banner de cookies (que só aparece se algum dos IDs estiver configurado).
- Eventos de conversão: `whatsapp_click`, `schedule_click`, `treatment_select`, `form_submit`, `directions_click`, `contact_click`. Os parâmetros enviados são apenas local do clique, slug do tratamento e canal — **nunca** nome, telefone, mensagem ou dados de saúde.
- O mapa do Google só carrega após clique (evita cookies de terceiros antes da interação).

---

## O que a clínica precisa fornecer

Itens marcados como provisórios no site até serem enviados:

1. ~~Número oficial do WhatsApp~~ — recebido e configurado: (13) 99741-2905.
2. **Número do CRO da responsável técnica** (Dra. Analita Barbosa — nome já configurado). Obrigatório na publicidade odontológica; enquanto faltar, o rodapé mostra "[CRO a definir]". Se aplicável, razão social e CNPJ.
3. ~~Endereço e horário~~ — configurados: Avenida Ana Costa, Santos (coordenadas -23.9592, -46.3318), segunda a sábado das 9h às 18h. **Faltam número do imóvel/sala, bairro e CEP**, para o endereço completo na tela e no Google.
4. **Fotografias profissionais**: hero, profissional/consultório, ambiente e uma por tratamento (JPG/WebP, mínimo 2000px no maior lado).
5. **Logotipo oficial em vetor (SVG)** — o atual foi reconstruído em tipografia (`components/ui/Logo.tsx`).
6. **Revisão dos textos dos tratamentos e do FAQ** pela profissional — confirmando quais procedimentos são de fato oferecidos.
7. **Imagens de resultados e depoimentos**, somente com consentimento por escrito dos pacientes.
8. **Política de Privacidade** revisada juridicamente (há campos `[entre colchetes]` a completar) e e-mail do encarregado (DPO).
9. Opcional: IDs do **GA4** e do **Meta Pixel**; URL de **webhook** para receber o formulário.

### Conformidade

- Os textos evitam promessas de resultado e incluem avisos de que não substituem avaliação individual — ainda assim, devem ser revisados conforme o Código de Ética Odontológica e as resoluções do CFO sobre publicidade.
- **Rinomodelação:** confirme junto ao CRO-SP o enquadramento atual do procedimento para cirurgiões-dentistas antes de publicar; se necessário, use `published: false`.
- Não foram inventados endereço, telefone, horários, credenciais, depoimentos ou resultados.

---

## Publicação (deploy)

Recomendado: **Vercel** (suporte nativo a Next.js).

1. Envie o repositório ao GitHub e importe o projeto na Vercel.
2. Em *Settings → Environment Variables*, cadastre as variáveis do `.env.example` (no mínimo `NEXT_PUBLIC_SITE_URL`).
3. Conecte o domínio próprio e atualize `NEXT_PUBLIC_SITE_URL` com ele.
4. Após publicar, cadastre o sitemap (`/sitemap.xml`) no Google Search Console e mantenha o Perfil da Empresa no Google com os mesmos dados do site.

> Variáveis `NEXT_PUBLIC_*` são incorporadas no build — após alterá-las, faça um novo deploy.

Outras plataformas que executem Node.js (Netlify, Render, VPS com `npm run build && npm run start`) também funcionam.
