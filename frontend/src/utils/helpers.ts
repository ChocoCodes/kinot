export const toUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}