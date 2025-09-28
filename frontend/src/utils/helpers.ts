export const toUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}

export const formatDate = (rawDate: string) => {
    const date = new Date(rawDate)

    const mm = date.getMonth()
    const dd = date.getDate()
    const yyyy = date.getFullYear()

    let h = date.getHours()
    const m = date.getMinutes()

    const prepand = h < 12 ? 'AM' : 'PM'
    h = h % 12
    h = h ? h : 12
    const formattedDate = `${ mm }-${ dd }-${ yyyy } ${ h }:${ m } ${ prepand }`
    return formattedDate
}

// Pass reqs: 1 uppercase, 1 lowercase, 1 digit, 8 min length
export const passRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";