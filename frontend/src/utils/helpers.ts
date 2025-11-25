export const toUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, " ");
}

export const toTitle = (str: string): string => !str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


const pad = (n: number) => n.toString().padStart(2, "0");

export const formatDate = (rawDate: string) => {
    const date = new Date(rawDate);

    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();

    let h = date.getHours();
    const m = date.getMinutes();

    const prepand = h < 12 ? 'AM' : 'PM';
    h = h % 12;
    h = h ? h : 12;
    const formattedDate = `${ pad(mm) }-${ pad(dd) }-${ yyyy } ${ pad(h) }:${ pad(m) } ${ prepand }`;
    return formattedDate;
}

// Pass reqs: 1 uppercase, 1 lowercase, 1 digit, 8 min length
export const passRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";