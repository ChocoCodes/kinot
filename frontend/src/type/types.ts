import { financeMeta } from "@pages/home-page";

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

export type GoalData = {
    id: number;
    required_amount: number;
    current_amount: number;
    description: string;
    created_at: string;
    title: string;
    image_path: string;
}

export type DashboardData = {
    finances: FinanceData;
    transactions: TransactionData[];
    goals: GoalData[];
}

export interface Payload {
    title: string;
    amount: number;
    year: number;
    month: number;
}

export type Transaction = Omit<TransactionData, 'user_id'>

export type FinanceMeta = keyof typeof financeMeta