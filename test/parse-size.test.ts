import { describe, expect, it } from 'vitest'

import { GB, GiB, KB, KiB, MB, MiB, TB, TiB, mustParseSize, parseSize } from '../src/index.js'

describe('parseSize', () => {
    it('parses values without unit as bytes', () => {
        expect(parseSize('10')?.bytes()).toBe(10)
        expect(parseSize('10 ')?.bytes()).toBe(10)
        expect(parseSize(' 10 ')?.bytes()).toBe(10)
    })

    it('parses bytes', () => {
        expect(parseSize('10 B')?.bytes()).toBe(10)
        expect(parseSize('10 byte')?.bytes()).toBe(10)
        expect(parseSize('10 bytes')?.bytes()).toBe(10)
    })

    it('parses decimal units', () => {
        expect(parseSize('1 KB')?.bytes()).toBe(KB)
        expect(parseSize('1.5 MB')?.bytes()).toBe(1.5 * MB)
        expect(parseSize('2 GB')?.bytes()).toBe(2 * GB)
        expect(parseSize('3 TB')?.bytes()).toBe(3 * TB)
    })

    it('parses binary units', () => {
        expect(parseSize('1 KiB')?.bytes()).toBe(KiB)
        expect(parseSize('1.5 MiB')?.bytes()).toBe(1.5 * MiB)
        expect(parseSize('2 GiB')?.bytes()).toBe(2 * GiB)
        expect(parseSize('3 TiB')?.bytes()).toBe(3 * TiB)
    })

    it('parses values without space before unit', () => {
        expect(parseSize('1.5MiB')?.bytes()).toBe(1.5 * MiB)
        expect(parseSize('250MB')?.bytes()).toBe(250 * MB)
    })

    it('parses lowercase units', () => {
        expect(parseSize('1 kb')?.bytes()).toBe(KB)
        expect(parseSize('1 mb')?.bytes()).toBe(MB)
        expect(parseSize('1 gb')?.bytes()).toBe(GB)
        expect(parseSize('1 tb')?.bytes()).toBe(TB)

        expect(parseSize('1 kib')?.bytes()).toBe(KiB)
        expect(parseSize('1 mib')?.bytes()).toBe(MiB)
        expect(parseSize('1 gib')?.bytes()).toBe(GiB)
        expect(parseSize('1 tib')?.bytes()).toBe(TiB)
    })

    it('parses uppercase and mixed-case units', () => {
        expect(parseSize('1 KB')?.bytes()).toBe(KB)
        expect(parseSize('1 MB')?.bytes()).toBe(MB)
        expect(parseSize('1 KiB')?.bytes()).toBe(KiB)
        expect(parseSize('1 MiB')?.bytes()).toBe(MiB)
        expect(parseSize('1 MIB')?.bytes()).toBe(MiB)
    })

    it('truncates fractional bytes', () => {
        expect(parseSize('1.5 B')?.bytes()).toBe(1)
        expect(parseSize('1.9 B')?.bytes()).toBe(1)
        expect(parseSize('0.9 B')?.bytes()).toBe(0)
    })

    it('rejects signed values', () => {
        expect(parseSize('-1 KiB')).toBeNull()
        expect(parseSize('+1 KiB')).toBeNull()
    })

    it('returns null for invalid values', () => {
        expect(parseSize('')).toBeNull()
        expect(parseSize('abc')).toBeNull()
        expect(parseSize('10 XB')).toBeNull()
        expect(parseSize('MB')).toBeNull()
        expect(parseSize('Infinity MB')).toBeNull()
        expect(parseSize('NaN MB')).toBeNull()
    })

    it('returns null for unsafe integer results', () => {
        expect(parseSize(`${Number.MAX_SAFE_INTEGER} TB`)).toBeNull()
    })
})

describe('mustParseSize', () => {
    it('returns parsed size', () => {
        expect(mustParseSize('1.5 MiB').bytes()).toBe(1.5 * MiB)
    })

    it('returns parsed bytes when unit is missing', () => {
        expect(mustParseSize('10').bytes()).toBe(10)
    })

    it('throws for invalid values', () => {
        expect(() => mustParseSize('abc')).toThrow(TypeError)
        expect(() => mustParseSize('10 XB')).toThrow(TypeError)
        expect(() => mustParseSize('-1 KiB')).toThrow(TypeError)
    })
})
