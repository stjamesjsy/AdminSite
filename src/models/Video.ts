export interface Video {
    id: string;
    createdAt: string;
    name: string;
    summary: string | null;
    author: string | null;
    url: string;
    screens: string[];
}