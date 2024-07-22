import { describe, expect, test } from 'vitest';
import { normalizeText } from '../src/index.js';
import { __test__ } from '../src/matcher.js';
import { createSource, expectEntries } from './helpers.js';

const {
    isNameInTitle,
    isNameInBody,
    isAliasInTitle,
    isAliasInBody,
    isHandleInTitle,
    isHandleInUrl,
    isHandleInLinks,
    isHandleInBody,
    isDomainInUrl,
    isDomainInLinks,
} = __test__;

describe('normalization', () => {
    test('normalize name', () => {
        const source = createSource({ name: 'fÓÓNamE' });

        expect(source.nameNormalized).toEqual('fooname');
    });

    test('normalize aliases', () => {
        const source = createSource({
            aliases: [
                { alias: 'fÓÓNamE', aliasIsCommon: true, },
                { alias: 'bäRNäMê', aliasIsCommon: true, },
            ]
        });

        expect(source.aliasesNormalized).toEqual([
            { alias: 'fÓÓNamE', aliasNormalized: 'fooname', aliasIsCommon: true },
            { alias: 'bäRNäMê', aliasNormalized: 'barname', aliasIsCommon: true },
        ]);
    });
});

describe('names', () => {
    describe('isNameInTitle', () => {
        test('nameIsCommon: true', () => {
            expectEntries(
                [
                    [true, 'name: rest of the title'],
                    [true, 'title which includes (name)'],
                    [true, 'title which includes [name]'],
                    [false, 'title which includes name anywhere'],
                ],
                createSource({ name: 'NäMê', nameIsCommon: true }),
                ({ source, content }) => isNameInTitle({ source, titleNormalized: normalizeText(content) })
            );
        });

        test('nameIsCommon: false', () => {
            expectEntries(
                [
                    [true, 'name: rest of the title'],
                    [true, 'title which includes (name)'],
                    [true, 'title which includes [name]'],
                    [true, 'title which includes name anywhere'],
                    [false, 'title which includes name_ anywhere'],
                    [false, 'title which includes _name anywhere'],
                    [false, 'nameX: rest of the title'],
                ],
                createSource({ name: 'NäMê', nameIsCommon: false }),
                ({ source, content }) => isNameInTitle({ source, titleNormalized: normalizeText(content) })
            );
        });
    });

    describe('isNameInBody', () => {
        test('nameIsCommon: true', () => {
            expectEntries(
                [
                    [true, 'name: rest of the body'],
                    [true, 'post body with\nname: in it'],
                    [true, 'body which includes\n (name)'],
                    [true, 'body which includes\n [name]'],
                    [false, 'body which includes name anywhere'],
                    [false, 'body which includes\nname anywhere']
                ],
                createSource({ name: 'name', nameIsCommon: true }),
                ({ source, content }) => isNameInBody({ source, bodyNormalized: normalizeText(content) })
            );
        });

        test('nameIsCommon: false', () => {
            expectEntries(
                [
                    [true, 'body which includes name anywhere'],
                    [true, 'body which includes\nname\n anywhere'],
                    [false, 'body which includes name_ anywhere'],
                    [false, 'body which includes _name anywhere'],
                    [false, '\nnameX: rest of the body'],
                ],
                createSource({ name: 'name', nameIsCommon: false }),
                ({ source, content }) => isNameInBody({ source, bodyNormalized: normalizeText(content) })
            );
        });
    });
});

describe('aliases', () => {
    describe('isAliasInTitle', () => {
        test('aliasIsCommon: true', () => {
            expectEntries(
                [
                    [true, 'alias1: rest of the title'],
                    [true, 'title which includes (alias1)'],
                    [true, 'title which includes [alias1]'],
                    [true, 'alias2: rest of the title'],
                    [true, 'title which includes (alias2)'],
                    [true, 'title which includes [alias2]'],
                    [false, 'title which includes alias1 anywhere'],
                    [false, 'title which includes alias2 anywhere'],
                ],
                createSource({
                    aliases: [
                        { alias: 'alias1', aliasIsCommon: true, },
                        { alias: 'alias2', aliasIsCommon: true, },
                    ]
                }),
                ({ source, content }) => isAliasInTitle({ source, titleNormalized: normalizeText(content) })
            );
        });

        test('aliasIsCommon: false', () => {
            expectEntries(
                [
                    [true, 'title which includes alias1 anywhere'],
                    [true, 'title which includes alias2 anywhere'],
                ],
                createSource({
                    aliases: [
                        { alias: 'alias1', aliasIsCommon: false, },
                        { alias: 'alias2', aliasIsCommon: false, },
                    ]
                }),
                ({ source, content }) => isAliasInTitle({ source, titleNormalized: normalizeText(content) })
            );
        });
    });

    describe('isAliasInBody', () => {
        test('aliasIsCommon: true', () => {
            expectEntries(
                [
                    [true, 'alias1: rest of the body'],
                    [true, 'body which includes (alias1)'],
                    [true, 'body which includes [alias1]'],
                    [true, 'post body with\nalias1: in it'],
                    [true, 'alias2: rest of the body'],
                    [true, 'body which includes (alias2)'],
                    [true, 'body which includes [alias2]'],
                    [true, 'post body with\nalias2: in it'],
                    [false, 'post body with\nalias1 in it'],
                    [false, 'body which includes alias1 anywhere'],
                    [false, 'body which includes alias2 anywhere'],
                ],
                createSource({
                    aliases: [
                        { alias: 'alias1', aliasIsCommon: true, },
                        { alias: 'alias2', aliasIsCommon: true, },
                    ]
                }),
                ({ source, content }) => isAliasInBody({ source, bodyNormalized: normalizeText(content) })
            );
        });

        test('aliasIsCommon: false', () => {
            expectEntries(
                [
                    [true, 'body which includes\nalias1\nanywhere'],
                    [true, 'body which includes\nalias2\nanywhere'],
                    [false, 'body which includes _alias1_ anywhere'],
                    [false, 'body which includes _alias2_ anywhere'],
                ],
                createSource({
                    aliases: [
                        { alias: 'alias1', aliasIsCommon: false, },
                        { alias: 'alias2', aliasIsCommon: false, },
                    ]
                }),
                ({ source, content }) => isAliasInBody({ source, bodyNormalized: normalizeText(content) })
            );
        });
    });
});

describe('handles', () => {
    test('isHandleInTitle', () => {
        expectEntries(
            [
                [true, '@handle1: rest of the title'],
                [true, 'title which includes (handle1)'],
                [true, 'title which includes [handle1]'],
                [true, 'title which includes @handle1'],
                [true, '@handle2: rest of the title'],
                [true, 'title which includes (handle2)'],
                [true, 'title which includes [handle2]'],
                [true, 'title which includes @handle2'],
            ],
            createSource({ handles: ['handle1', 'handle2'] }),
            ({ source, content }) => isHandleInTitle({ source, titleNormalized: normalizeText(content) })
        );
    });

    test('isHandleInUrl', () => {
        expectEntries(
            [
                [true, new URL('https://twitter.com/handle1')],
                [true, new URL('https://twitter.com/handle1/')],
                [true, new URL('https://twitter.com/handle1/status/12345')],
                [true, new URL('https://twitter.com/handle2')],
                [true, new URL('https://twitter.com/handle2/')],
                [true, new URL('https://twitter.com/handle2/status/12345')],
                [true, new URL('https://x.com/handle1')],
                [true, new URL('https://x.com/handle1/')],
                [true, new URL('https://x.com/handle1/status/12345')],
                [true, new URL('https://x.com/handle2')],
                [true, new URL('https://x.com/handle2/')],
                [true, new URL('https://x.com/handle2/status/12345')],
                [false, new URL('https://example.com/handle1')],
                [false, new URL('https://example.com/handle1/')],
                [false, new URL('https://example.com/handle1/status/12345')],
                [false, new URL('https://example.com/handle2')],
                [false, new URL('https://example.com/handle2/')],
                [false, new URL('https://example.com/handle2/status/12345')],
            ],
            createSource({ handles: ['handle1', 'handle2'] }),
            ({ source, content }) => isHandleInUrl({ source, url: content })
        );
    });

    test('isHandleInLinks', () => {
        expectEntries(
            [
                [true, [new URL('https://x.com/handle1')]],
                [true, [new URL('https://x.com/handle1/')]],
                [true, [new URL('https://x.com/handle1/path')]],
                [true, [new URL('https://x.com/handle2')]],
                [true, [new URL('https://x.com/handle2/')]],
                [true, [new URL('https://x.com/handle2/path')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle1')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle1/')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle1/path')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle2')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle2/')]],
                [true, [new URL('https://ignored.com/handle1'), new URL('https://x.com/handle2/path')]],
                [false, [new URL('https://x.com/status/handle1')]],
                [false, [new URL('https://twitter.com/handle123')]],
            ],
            createSource({ handles: ['handle1', 'handle2'] }),
            ({ source, content }) => isHandleInLinks({ source, urls: content })
        );
    });

    test('isHandleInBody', () => {
        expectEntries(
            [

                [true, 'handle1: rest of the body'],
                [true, '@handle1: rest of the body'],
                [true, 'body which includes (handle1)'],
                [true, 'body which includes [handle1]'],
                [true, 'body which includes @handle1'],
                [true, 'body which includes\nhandle1:'],
                [true, 'handle2: rest of the body'],
                [true, '@handle2: rest of the body'],
                [true, 'body which includes (handle2)'],
                [true, 'body which includes [handle2]'],
                [true, 'body which includes @handle2'],
                [true, 'body which includes\nhandle2:'],
                [false, 'body which includes handle1'],
                [false, 'body which includes handle2'],
            ],
            createSource({ handles: ['handle1', 'handle2'] }),
            ({ source, content }) => isHandleInBody({ source, bodyNormalized: normalizeText(content) })
        );
    });
});

describe('domains', () => {
    test('isDomainInUrl', () => {
        expectEntries(
            [
                [true, new URL('https://foo.com')],
                [true, new URL('https://www.foo.com')],
                [true, new URL('https://sub1.foo.com')],
                [true, new URL('https://sub1.sub2.foo.com')],
                [true, new URL('https://bar.com')],
                [true, new URL('https://www.bar.com')],
                [true, new URL('https://sub1.bar.com')],
                [true, new URL('https://sub1.sub2.bar.com')],
                [false, new URL('https://foo.com.au')],
                [false, new URL('https://bar.com.au')],
            ],
            createSource({ domains: ['foo.com', 'bar.com'] }),
            ({ source, content }) => isDomainInUrl({ source, url: content })
        );
    });

    test('isDomainInLinks', () => {
        expectEntries(
            [
                [true, [new URL('https://foo.com')]],
                [true, [new URL('https://www.foo.com')]],
                [true, [new URL('https://sub1.foo.com')]],
                [true, [new URL('https://sub1.sub2.foo.com')]],
                [true, [new URL('https://bar.com')]],
                [true, [new URL('https://www.bar.com')]],
                [true, [new URL('https://sub1.bar.com')]],
                [true, [new URL('https://sub1.sub2.bar.com')]],
                [true, [new URL('https://ignored.com'), new URL('https://foo.com')]],
                [true, [new URL('https://ignored.com'), new URL('https://bar.com')]],
            ],
            createSource({ domains: ['foo.com', 'bar.com'] }),
            ({ source, content }) => isDomainInLinks({ source, urls: content })
        );
    });
});