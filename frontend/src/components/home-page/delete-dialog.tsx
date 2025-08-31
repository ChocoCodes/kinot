interface DeleteDialogProps {
    title: string
}
const DeleteDialog = ({ title }: DeleteDialogProps) => {
    return (
        <p>{title}</p>
    )
}

export default DeleteDialog