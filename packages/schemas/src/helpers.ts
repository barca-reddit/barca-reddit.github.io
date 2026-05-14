import type { RefinementCtx } from 'zod';
import z from 'zod';

/**
 * Remove diacritics and convert to lowercase
 * 
 * @note There is a slight performance penalty when using modern unicode
 * property escapes so prefer using the old method with character class
 * range for now.
 * 
 * @see https://stackoverflow.com/a/37511463/3258251
 */
export function normalizeText(text: string) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export function preprocessStringToCommaSeparatedArrayOfUUIDs(value: unknown, ctx: RefinementCtx) {
    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    if (value.trim() === '') {
        return undefined;
    }

    try {
        const uuids = value.split(',').map(item => item.trim());

        if (uuids.some(uuid => uuid.length === 0) || uuids.some(uuid => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid input. Expected comma-separated string of UUIDs.',
                fatal: true,
            });

            return z.NEVER;
        }

        return uuids;
    }

    catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid input. Expected comma-separated string with values.',
            fatal: true,
        });

        return z.NEVER;
    }
}

export function preprocessStringToCommaSeparatedArrayOfUsernames(value: unknown, ctx: RefinementCtx) {
    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    if (value.trim() === '') {
        return undefined;
    }

    try {
        const usernames = value.split(',').map(item => item.trim());

        // reddit usernames can only contain alphanumeric characters, underscores and hyphens
        if (usernames.some(username => username.length === 0) || usernames.some(username => /[^a-zA-Z0-9_-]/.test(username))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid input. Reddit usernames can only contain alphanumeric characters, underscores and hyphens.',
                fatal: true,
            });

            return z.NEVER;
        }

        return usernames;
    }

    catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid input. Expected comma-separated string with values.',
            fatal: true,
        });

        return z.NEVER;
    }
}

export function preprocessEmptyStringToUndefined(value: unknown) {
    if (typeof value === 'string' && value.trim() === '') {
        return undefined;
    }

    return value;
}

export function preprocessStringToBoolean(value: unknown, ctx: RefinementCtx) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    const lowerValue = value.toLowerCase();

    if (lowerValue === 'true' || lowerValue === '1') {
        return true;
    }

    if (lowerValue === 'false' || lowerValue === '0') {
        return false;
    }

    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid boolean string',
        fatal: true,
    });

    return z.NEVER;
}

/**
 * @see https://zod.dev/ERROR_HANDLING
 */
export function preprocessStringToArray(value: unknown, ctx: RefinementCtx) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    try {
        return JSON.parse(value);
    }

    catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON input',
            fatal: true,
        });

        return z.NEVER;
    }
}