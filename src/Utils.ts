
export const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const cloneJson = (json: any) => {
    return JSON.parse(JSON.stringify(json));
}