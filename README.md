# Luna · Dashboard Financeiro

Dashboard pessoal em português do Brasil inspirado na direção visual Canva: azul-noite, violeta, rosa e ciano, com estética fintech dark neon premium. Código leve em HTML, CSS e JavaScript modular; sem dependências de runtime ou instalação de pacotes.

## O que funciona

- Sidebar, topbar e navegação por hash, compatível com subpastas do GitHub Pages.
- KPIs reconciliados com os dados, fluxo financeiro semanal e donut de categorias.
- Dívidas, reservas com metas, investimentos, patrimônio e insight demonstrativo.
- Filtros de mês e de movimentações, busca por nome/categoria e exportação CSV.
- Ocultação de valores, menu móvel, navegação por teclado e tabela acessível do gráfico.
- Layout responsivo, login Supabase opcional e tratamento de carregamento, erro e mês vazio.

**Os dados padrão são fictícios.** O insight demo é um texto de exemplo, não uma chamada de IA. Nenhum serviço financeiro foi conectado. A estrutura está pronta para integração, conforme [docs/integracoes.md](docs/integracoes.md).

## Rodar localmente

Requisito: Node.js 22 ou superior. Nenhuma chave é necessária para a demo.

```sh
npm run dev
```

Abra `http://127.0.0.1:4173`. No Windows com política restritiva do PowerShell, use `npm.cmd` no lugar de `npm`.

```sh
npm test
npm run build
npm run preview
```

O build gera `dist/`, pronto para hospedagem estática. Pare um servidor antes de iniciar outro na mesma porta ou use a variável `PORT`. Não abra `index.html` diretamente por `file://`, pois o app usa módulos ES.

## Variáveis de ambiente

Copie `.env.example` para `.env`. O build lê apenas esta lista pública:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PUBLIC_DATA_MODE` | `demo` | `demo` ou `supabase` |
| `PUBLIC_SUPABASE_URL` | vazio | Origem HTTPS do projeto |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | vazio | Somente chave `sb_publishable_` |

Variáveis públicas são visíveis no navegador. `.env` e `.env.*` estão ignorados pelo Git; somente o exemplo é versionado. O build não copia `.env`, SQL, documentação nem arquivos do repositório para `dist`. Chaves secretas/service_role, tokens de IA, credenciais do n8n e senha do banco **nunca** entram no frontend. Segurança dos dados reais depende de autenticação, RLS e grants corretos, não de esconder uma chave pública.

`npm run dev` usa sempre a demo do código-fonte. Para testar `.env`, execute build e preview. Consulte a [integração detalhada](docs/integracoes.md) antes de ativar dados reais.

## Publicar no GitHub Pages

O workflow `.github/workflows/pages.yml` testa, constrói e publica a branch `main`.

1. Envie o conteúdo desta pasta para a raiz do repositório.
2. No GitHub, abra **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Se necessário, inicie o workflow em **Actions → Validate and deploy Pages → Run workflow**.
4. O endereço aparecerá em Pages e no ambiente `github-pages` após o deploy.

Por padrão publica demo. Para Supabase, defina as três variáveis em **Settings → Secrets and variables → Actions → Variables**, execute a migration e configure usuários. Somente valores públicos pertencem a essas variáveis. GitHub Pages hospeda o frontend; o backend fica no Supabase/n8n.

Todos os recursos usam caminhos relativos, então `https://usuario.github.io/repositorio/` funciona sem configuração de base. A navegação por `#transactions`, por exemplo, preserva refresh e links diretos.

## Publicar na Vercel

Importe o repositório, use preset **Other**, build **npm run build** e diretório **dist**. O arquivo `vercel.json` já define essas opções. Configure as variáveis públicas no projeto, se usar Supabase, e gere um novo deploy. Não há API privada hospedada neste frontend.

## Organização

```text
src/app.js                 Interface e interações
src/styles.css             Design e breakpoints
src/data.js                Dados demo, cálculos e validação
src/services.js            Adaptador demo/Supabase e autenticação
src/config.js              Configuração demo (substituída no build)
scripts/                   Build, preview e exemplo de payload
tests/                     Reconciliação, contrato e segurança do build
supabase/                  Migration com RLS por usuário
docs/integracoes.md         Contrato e plano de integração n8n/views
.github/workflows/          Testes e deploy GitHub Pages
```

## Decisões e limites

Os valores demo são estáticos por mês (agosto, setembro e outubro de 2026). KPIs e gráficos são derivados da mesma lista de transações. Reservas/dívidas/investimentos são snapshots, não históricos simulados. Não há persistência de edições, cadastro de transações, Open Finance ou aconselhamento financeiro automatizado nesta versão. O adaptador não consulta diretamente `financial_dashboard_summary` e `monthly_spending_by_category` porque seus schemas não foram fornecidos; o contrato intermediário documenta a conexão sem presumir suas colunas.

As fontes DM Sans e Manrope são carregadas pelo Google Fonts; sem rede, fontes locais substitutas mantêm o layout. Nenhum analytics é incluído. Para eliminar essa requisição externa, remova a primeira linha de `src/styles.css` ou hospede as fontes localmente.

## Fontes oficiais

- [Workflows para GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Chaves públicas e privadas no Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
- [RLS do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
