import { API_URL } from "./constants";

async function _apiRequest(url: string, method: string, route: string, data?: any): Promise<Response> {
    const isJson = typeof data === "object";
    const apiKey = localStorage.getItem("apiKey");

    let options: any = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "X-Access-Token": apiKey
        }
    }

    if (data) {
        options.body = (isJson ? JSON.stringify(data) : data);
    }

    const response = await fetch(`${url}${route}`, options);
    return response;
}

export async function newApiRequest(method: string, route: string, data?: any): Promise<Response> {
    return _apiRequest(API_URL, method, route, data);
}

export async function newLocalApiRequest(method: string, route: string, data?: any): Promise<Response> {
    return _apiRequest("/api", method, route, data);
}

export function formatTimeSince(dateString: string, shortWords: boolean = false): string {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    if (isNaN(inputDate.getTime())) {
        return "Invalid date";
    }

    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);


    if (secondsDifference < 60) {
        return `${secondsDifference} ${shortWords ? "sec" : "second"}${secondsDifference === 1 ? "" : "s"} ago`;
    } else if (minutesDifference < 60) {
        return `${minutesDifference} ${shortWords ? "min" : "minute"}${minutesDifference === 1 ? "" : "s"} ago`;
    } else if (hoursDifference < 24) {
        return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
    } else {
        return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
    }
}

export function formatDate(dateString: string) {
    const now = new Date(dateString);
    const padZero = (num: number) => num.toString().padStart(2, '0');

    const dd = padZero(now.getDate());
    const mm = padZero(now.getMonth() + 1);
    const yy = now.getFullYear().toString().slice(-2);
    const hh = padZero(now.getHours());
    const min = padZero(now.getMinutes());
    const ss = padZero(now.getSeconds());

    return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}

export function generateRandomChars(length: number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
