export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const monthLabel = value => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T12:00:00Z`));
export const sum = items => items.reduce((total, item) => total + item.amount, 0);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export function totals(data) {
  const income = sum(data.transactions.filter(t => t.type === 'income'));
  const expenses = sum(data.transactions.filter(t => t.type === 'expense'));
  const reserves = sum(data.reserves);
  const investments = sum(data.investments);
  const debts = sum(data.debts);
  const balance = data.openingBalance + income - expenses;
  return { income, expenses, reserves, investments, debts, balance, netWorth: balance + reserves + investments - debts };
}
export function categories(data) {
  const map = new Map();
  for (const t of data.transactions.filter(t => t.type === 'expense')) map.set(t.category, (map.get(t.category) || 0) + t.amount);
  return [...map].map(([name, amount]) => ({name, amount})).sort((a,b) => b.amount-a.amount);
}
export function cashFlow(data) {
  return Array.from({length: 4}, (_, i) => {
    const entries = data.transactions.filter(t => Math.min(3, Math.floor((Number(t.date.slice(-2))-1)/7)) === i);
    return { label: `Semana ${i+1}`, income: sum(entries.filter(t => t.type==='income')), expense: sum(entries.filter(t => t.type==='expense')) };
  });
}
export function demoData(month = '2026-10') {
  const factor = month === '2026-09' ? 0.92 : month === '2026-08' ? 0.86 : 1;
  const tx = (day, name, category, type, amount) => ({ id: `${month}-${day}-${name}`, date: `${month}-${day}`, name, category, type, amount: Math.round(amount*factor) });
  return {
    month, openingBalance: 0, updatedAt: `${month}-28T15:30:00Z`,
    transactions: [
      tx('02','Salário','Salário','income',6500), tx('04','Aluguel','Moradia','expense',1800),
      tx('08','Supermercado','Alimentação','expense',650), tx('10','Projeto freelance','Freelance','income',1500),
      tx('12','Restaurantes','Alimentação','expense',400), tx('15','Mobilidade','Transporte','expense',450),
      tx('18','Academia e bem-estar','Saúde','expense',350), tx('20','Consultoria','Freelance','income',1500),
      tx('22','Cinema e lazer','Lazer','expense',400), tx('25','Assinaturas','Outros','expense',200),
      tx('28','Compras pessoais','Outros','expense',400)
    ],
    debts: [ {name:'Cartão de crédito',amount:2800, installment:400, interest:8.5,priority:'Alta'}, {name:'Crédito pessoal',amount:5000,installment:520,interest:2.1,priority:'Média'} ],
    reserves: [{name:'Reserva de emergência',amount:2500,goal:10000,icon:'shield'}, {name:'Próxima viagem',amount:1000,goal:5000,icon:'plane'}],
    investments: [{name:'Tesouro Selic',amount:5000,kind:'Renda fixa'}, {name:'CDB · liquidez diária',amount:3000,kind:'Renda fixa'}],
    insight: 'Sua reserva de emergência já começou a crescer. Nesta simulação, o cartão tem a maior taxa de juros entre as dívidas cadastradas. Compare o custo das dívidas antes de definir seus próximos aportes.'
  };
}
export function toCsv(transactions) {
  const cell = v => `"${String(v).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"','""')}"`;
  return '\uFEFF' + [['Data','Descrição','Categoria','Tipo','Valor (BRL)'], ...transactions.map(t=>[t.date,t.name,t.category,t.type==='income'?'Receita':'Despesa',t.amount.toFixed(2).replace('.',',')])].map(row=>row.map(cell).join(';')).join('\r\n');
}
export function validateDashboard(data) {
  if (!data || !/^\d{4}-\d{2}$/.test(data.month) || !Number.isFinite(data.openingBalance)) throw new Error('Resumo financeiro inválido.');
  for (const key of ['transactions','debts','reserves','investments']) {
    if (!Array.isArray(data[key])) throw new Error(`Campo ausente: ${key}`);
    for (const item of data[key]) if (typeof item.name !== 'string' || !Number.isFinite(item.amount) || item.amount < 0) throw new Error(`Valor inválido em ${key}`);
  }
  for (const t of data.transactions) if (!['income','expense'].includes(t.type) || !/^\d{4}-\d{2}-\d{2}$/.test(t.date) || t.date.slice(0,7)!==data.month || typeof t.category!=='string') throw new Error('Transação inválida.');
  for (const r of data.reserves) if (!Number.isFinite(r.goal) || r.goal<=0) throw new Error('Meta de reserva inválida.');
  for (const d of data.debts) if (!Number.isFinite(d.installment) || !Number.isFinite(d.interest) || d.installment<0 || d.interest<0) throw new Error('Dívida inválida.');
  return data;
}
