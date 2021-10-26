let requests: number = 0;

export function IncrementRequests(): void {
    requests++;
}

export function GetRequestCount(): number {
    return requests;
}