// We need to convert raw headers into a map because it arrices in this format:
// [Header, Value, Header, Value, ...]
export function rawHeadersToMap(headers: string[]): Map<string, string> {
    const headerMap = new Map<string, string>();
    for (let i = 0; i < headers.length; i += 2) {
        headerMap.set(headers[i], headers[i + 1]);
    }

    return headerMap;
}

// Sort url query string in order go give a consistent result when searching for a matching url in config file
export function sortUrlQueryStrings(url: string): string {
    try {
        const urlObj = new URL(url);
        const urlWithoutQuery = urlObj.origin + urlObj.pathname;

        return urlWithoutQuery + sortQueryString(urlObj.searchParams);
    } catch {
        return url;
    }
}

// Sort query string from giving URL search params
function sortQueryString(searchParams: URLSearchParams): string {
    let queryKeys = Array.from(searchParams.keys());
    queryKeys = queryKeys.sort();

    const queries: string[] = [];
    for (let i = 0; i < queryKeys.length; i++) {
        queries.push(`${queryKeys[i]}=${searchParams.get(queryKeys[i])}`);
    }

    if (queries.length === 0) return '';

    return '?' + queries.join('&');
}

export function getUrlWithoutOrigin(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname + sortQueryString(urlObj.searchParams);
    } catch {
        return '';
    }
}
