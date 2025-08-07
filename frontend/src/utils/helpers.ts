export const toUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}

export const formatDate = (rawDate: string) => {
    const date = new Date(rawDate)
    const formattedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
    return formattedDate
}