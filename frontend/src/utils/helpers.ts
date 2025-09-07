export const toUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}

export const formatDate = (rawDate: string) => {
    const date = new Date(rawDate)
    const formattedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
    return formattedDate
}

// Pass reqs: 1 uppercase, 1 lowercase, 1 digit, 8 min length
export const passRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";