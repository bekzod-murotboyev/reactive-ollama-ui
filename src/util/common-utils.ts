export const normalizeStreamChunk = (s: string) =>
    s
        .replace(/\\n/g, "\n")
        .replace(/[\u00A0\u202F\u2009\u200A\u2007\u2002-\u2006]/g, " ")
        .replace(/\u2011/g, "-");

// add a space only when needed between wordy boundaries
export const needsSpace = (a: string, b: string) => {
    return a &&
        !/\s$/.test(a) &&
        !/^\s/.test(b) &&
        !/^[.,!?;:')\]}]/.test(b)
};
