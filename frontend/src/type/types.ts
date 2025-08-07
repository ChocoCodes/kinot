type FinanceSnapshot = {
    id: number;
    user_id: number;
    date: string;
    savings: number;
    year: number;
    month: number;
    expenses: number;
    allowance: number;
}

export type FinanceData = {
    current: FinanceSnapshot;
    previous: FinanceSnapshot;
    savings_pct: number;
    spendings_pct: number;
}

export type TransactionData = {
    id: number;
    user_id: number;
    category: string;
    amount: number;
    created_at: string;
    method: string;
    description: string;
}

export type Transaction = Omit<TransactionData, 'user_id'>

export type DashboardData = {
    finances: FinanceData;
    transactions: TransactionData[];
}
