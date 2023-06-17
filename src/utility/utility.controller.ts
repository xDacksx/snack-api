import colour from "colors";

/**
 * Prints a green message on console.
 * @param part1 First part of the message.
 * @param important Green highlighted part of the message.
 * @param part2 Final part of the message.
 */
export function SuccessMessage(
    part1: string,
    important?: string,
    part2?: string
): void {
    const message = `${colour.green("[Success]:")} ${colour.white(
        part1
    )} ${colour.yellow(important || "")} ${colour.white(part2 || "")}`;
    console.log(message);
}
/**
 * Prints a red message on console.
 * @param part1 First part of the message.
 * @param important Red highlighted part of the message.
 * @param part2 Final part of the message.
 */
export function ErrorMessage(
    part1: string,
    important?: string,
    part2?: string
): void {
    const message = `${colour.red("[Error]:")}   ${colour.white(
        part1
    )} ${colour.yellow(important || "")} ${colour.white(part2 || "")}`;
    console.log(message);
}
/**
 * Prints a yellow message on console.
 * @param part1 First part of the message.
 * @param important Yellow highlighted part of the message.
 * @param part2 Final part of the message.
 */
export function WarnMessage(
    part1: string,
    important?: string,
    part2?: string
): void {
    const message = `${colour.yellow("[Warning]:")} ${colour.white(
        part1
    )} ${colour.yellow(important || "")} ${colour.white(part2 || "")}`;
    console.log(message);
}
/**
 * Prints a blue message on console
 * @param part1 First part of the message.
 * @param important Blue highlighted part of the message.
 * @param part2 Final part of the message.
 */
export function InfoMessage(
    part1: string,
    important?: string,
    part2?: string
): void {
    const message = `${colour.cyan("[Info]:")}    ${colour.white(
        part1
    )} ${colour.yellow(important || "")} ${colour.white(part2 || "")}`;
    console.log(message);
}
/**
 * Replace a part of a text.
 * @param text Text to be replace a part of.
 * @param pattern What is going to be replaced.
 * @param replacement Replacement.
 */
export function replaceAll(
    text: string,
    pattern: string,
    replacement: string
): string {
    //@ts-ignore
    return text.replaceAll(pattern, replacement);
}
/**
 * Return date as text.
 * @returns 25-12-2000-08-05-01
 */
export function getDateAsText(): string {
    function checkTime(i: any) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    const date: Date = new Date();

    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    const year: number = date.getFullYear();

    const hour: number = date.getHours();
    const minutes: number = checkTime(date.getMinutes());
    const seconds: number = checkTime(date.getSeconds());

    const time: string = `${hour}-${minutes}-${seconds}`;

    if (month < 10) {
        return `${day}-0${month}-${year}-${time}`;
    } else {
        return `${day}-${month}-${year}-${time}`;
    }
}

export function paginate(array: any[], page_size: number, page_number: number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
