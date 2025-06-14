import type { UserInfo } from './RegisterForm'

interface RecoveryProps {
    onBack: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    data: UserInfo;
}

export const RecoveryForm = ({ onBack, onSubmit, data }: RecoveryProps) => {
    return (
        <p>Recovery Form</p>
    )
}
