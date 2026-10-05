# Integração Supabase + n8n

## Limites desta entrega

O modo demo está funcional. O adaptador Supabase inclui autenticação por e-mail/senha, sessão em memória e leitura de snapshots com RLS. Não foi conectado a uma conta Supabase real, nem a um workflow n8n real. Não há conexão bancária, captura WhatsApp, gravação de transações, refresh automático de token ou geração de IA no navegador.

## Caminho dos dados

WhatsApp/Telegram → n8n → tabelas financeiras e views no Supabase → snapshot mensal → dashboard autenticado.

As views mencionadas na conversa são `financial_dashboard_summary` e `monthly_spending_by_category`. Seus schemas não foram fornecidos. Não inventamos consultas nem alteramos essas views. O adaptador em `src/services.js` recebe um contrato explícito da nova tabela `dashboard_snapshots`; futuramente ele pode ser trocado por consultas às views após validar colunas, regras de saldo e RLS.

## Ativar Supabase

1. Execute `supabase/001_dashboard_snapshots.sql` em um ambiente de desenvolvimento.
2. Crie um usuário de teste em Supabase Authentication e habilite o provedor e-mail/senha. Cadastro, recuperação de senha e confirmação de e-mail são gerenciados fora desta interface.
3. Use `.env.example` para criar `.env`. Defina `PUBLIC_DATA_MODE=supabase`, URL do projeto e chave **sb_publishable_**.
4. Execute `npm run build` e `npm run preview`. O modo conectado mostra o formulário de login. `.env` só é lido durante o build; `npm run dev` sempre usa demo.
5. Insira um snapshot pelo backend com o UUID desse usuário. O exemplo de payload pode ser gerado com `node scripts/example-payload.mjs`.
6. Valide com duas contas diferentes: cada uma deve ver apenas o próprio snapshot. Sem sessão não deve haver acesso. Teste também mês vazio, senha incorreta e sessão expirada.

A sessão fica apenas em memória e expira conforme o token. Recarregar exige novo login. Ao expirar, o próximo carregamento volta ao login. Para uma versão de produção com sessões persistentes, adote o SDK oficial com uma estratégia de sessão revisada.

## Contrato do snapshot

O objeto `payload` corresponde a `demoData()` em `src/data.js`:

- `month`: `YYYY-MM`; `openingBalance`: saldo disponível no início do mês, em reais.
- `transactions`: lista de `{id, date: YYYY-MM-DD, name, category, type: income|expense, amount}`. `amount` sempre positivo.
- `debts`: lista de `{name, amount, installment, interest, priority}`. Juros são percentuais mensais.
- `reserves`: lista de `{name, amount, goal, icon}`. `goal` deve ser maior que zero.
- `investments`: lista de `{name, amount, kind}`.
- `insight`: texto simples, nunca HTML; `updatedAt`: data ISO.

Montantes em reais como números JSON, sem `R$` ou separadores locais. Cada transação deve pertencer ao mês do snapshot. Snapshots sem transações usam `[]`, não null. Todas as listas são obrigatórias.

O saldo disponível é `openingBalance + receitas − despesas`. Reservas e investimentos devem ser **excluídos do saldo disponível** para evitar dupla contagem. Patrimônio é `saldo + reservas + investimentos − dívidas`. Transferências entre contas, reservas e carteira não são receita/despesa; o agregador precisa reconciliar o saldo de abertura/fechamento conforme seu modelo real. Não conectar sem verificar essa regra contra os dados originais.

## Workflow n8n sugerido

1. Trigger de agendamento ou evento financeiro validado.
2. Identifique `user_id` usando um vínculo verificado do remetente ao usuário. Nunca confie em UUID recebido livremente por mensagem.
3. Consulte as views por usuário e mês e complemente com transações, dívidas, reservas e investimentos. Valide o contrato acima.
4. Gere o insight no backend, se desejar, com tratamento de erro. Use texto simples e sinalize quando indisponível. Envie apenas os dados necessários ao provedor de IA escolhido.
5. Faça upsert idempotente na tabela `dashboard_snapshots`, chave composta `user_id,month`, com `month` no primeiro dia do mês e `updated_at` atual.
6. Faça o dashboard recarregar o período (ou adicione atualização periódica posteriormente). Esta versão atualiza ao mudar o mês ou recarregar e autenticar.

No node Supabase do n8n, configure a credencial privada no gerenciador de credenciais. Para HTTP Request use as instruções oficiais de autenticação da chave escolhida; nunca exporte workflow contendo headers secretos literais. O payload de escrita é `{user_id, month, payload, updated_at}`. O node deve usar upsert pela chave composta, sem apagar dados de outros usuários. Trate retries e falhas no n8n. Não há webhook n8n chamado pelo frontend.

## Segurança das views existentes

Views expostas precisam respeitar as políticas das tabelas subjacentes; em Postgres compatível use `security_invoker = true` e RLS nas tabelas. Um filtro de UUID no cliente não substitui RLS. Não aplicar mudanças nas views sem revisar seu SQL e seus grants. A migration deste projeto isola os snapshots sem depender da segurança das views atuais.

## Referências oficiais

- [Chaves de API Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Segurança de views](https://supabase.com/docs/guides/database/views)
