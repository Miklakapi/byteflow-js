import { describe, expect, it } from 'vitest'

import { B, GB, GiB, KB, KiB, MB, MiB, TB, TiB, bytes, size } from '../src/index.js'

describe('Size units', () => {
    it('defines binary size units', () => {
        expect(B).toBe(1)
        expect(KiB).toBe(1024)
        expect(MiB).toBe(1024 * 1024)
        expect(GiB).toBe(1024 * 1024 * 1024)
        expect(TiB).toBe(1024 * 1024 * 1024 * 1024)
    })

    it('defines decimal size units', () => {
        expect(KB).toBe(1000)
        expect(MB).toBe(1000 * 1000)
        expect(GB).toBe(1000 * 1000 * 1000)
        expect(TB).toBe(1000 * 1000 * 1000 * 1000)
    })
})

describe('Size', () => {
    it('stores size as bytes', () => {
        const fileSize = size(1536)

        expect(fileSize.bytes()).toBe(1536)
    })

    it('can be created from bytes helper', () => {
        const fileSize = bytes(2048)

        expect(fileSize.bytes()).toBe(2048)
    })

    it('converts to decimal units', () => {
        const fileSize = size(1.5 * MB)

        expect(fileSize.kilobytes()).toBe(1500)
        expect(fileSize.megabytes()).toBe(1.5)
        expect(fileSize.gigabytes()).toBe(0.0015)
        expect(fileSize.terabytes()).toBe(0.0000015)
    })

    it('converts to binary units', () => {
        const fileSize = size(1.5 * MiB)

        expect(fileSize.kibibytes()).toBe(1536)
        expect(fileSize.mebibytes()).toBe(1.5)
        expect(fileSize.gibibytes()).toBe(1.5 / 1024)
        expect(fileSize.tebibytes()).toBe(1.5 / 1024 / 1024)
    })

    it('formats bytes without decimals', () => {
        const fileSize = size(999)

        expect(fileSize.toString()).toBe('999 B')
        expect(fileSize.binaryString()).toBe('999 B')
        expect(fileSize.decimalString()).toBe('999 B')
    })

    it('formats binary size by default', () => {
        const fileSize = size(1536)

        expect(fileSize.toString()).toBe('1.5 KiB')
        expect(fileSize.binaryString()).toBe('1.5 KiB')
    })

    it('formats decimal size explicitly', () => {
        const fileSize = size(1500)

        expect(fileSize.decimalString()).toBe('1.5 KB')
    })

    it('formats negative values using absolute value for unit selection', () => {
        const fileSize = size(-1536)

        expect(fileSize.toString()).toBe('-1.5 KiB')
        expect(fileSize.decimalString()).toBe('-1.54 KB')
    })

    it('rejects non-finite values', () => {
        expect(() => size(Number.NaN)).toThrow(TypeError)
        expect(() => size(Number.POSITIVE_INFINITY)).toThrow(TypeError)
        expect(() => size(Number.NEGATIVE_INFINITY)).toThrow(TypeError)
    })

    it('truncates fractional bytes', () => {
        const fileSize = size(1536.9)

        expect(fileSize.bytes()).toBe(1536)
    })
})
