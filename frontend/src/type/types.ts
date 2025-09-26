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
    field: string;
    amount: number;
    method: string;
    year: number;
    month: number;
    description: string;
}

export type Transaction = Omit<TransactionData, 'user_id'>

export type FinanceMeta = keyof typeof financeMeta

export type UserCredentials = {
    username: string;
    question: string;
    answer: string;
}

export type NewPassword = {
    password: string;
    confirm: string;
    token: string;
}

export interface ChildProps {
    children: React.ReactNode;
}

export type User = {
    id: number;
    token: string;
    username: string;
    profilePath: string;
}

export type AccountInfo = {
    username: string;
    fullname: string;
    imgPath: string;
}

export type PasswordInfo = {
    current: string;
    new: string;
    confirm: string;
}