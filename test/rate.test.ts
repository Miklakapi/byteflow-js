import { describe, expect, it } from 'vitest'

import {
    Bps,
    GBps,
    GiBps,
    KBps,
    KiBps,
    MB,
    MBps,
    MiB,
    MiBps,
    TBps,
    TiBps,
    bytesPerSecond,
    durationFor,
    perSecond,
    rate,
    size,
    transferredIn,
} from '../src/index.js'

describe('Rate units', () => {
    it('defines binary rate units', () => {
        expect(Bps).toBe(1)
        expect(KiBps).toBe(1024)
        expect(MiBps).toBe(1024 * 1024)
        expect(GiBps).toBe(1024 * 1024 * 1024)
        expect(TiBps).toBe(1024 * 1024 * 1024 * 1024)
    })

    it('defines decimal rate units', () => {
        expect(KBps).toBe(1000)
        expect(MBps).toBe(1000 * 1000)
        expect(GBps).toBe(1000 * 1000 * 1000)
        expect(TBps).toBe(1000 * 1000 * 1000 * 1000)
    })
})

describe('Rate', () => {
    it('stores rate as bytes per second', () => {
        const transferRate = rate(1536)

        expect(transferRate.bytesPerSecond()).toBe(1536)
    })

    it('truncates fractional bytes per second', () => {
        const transferRate = rate(1536.9)

        expect(transferRate.bytesPerSecond()).toBe(1536)
    })

    it('can be created from bytes per second helper', () => {
        const transferRate = bytesPerSecond(2048)

        expect(transferRate.bytesPerSecond()).toBe(2048)
    })

    it('converts to decimal byte units per second', () => {
        const transferRate = rate(1.5 * MBps)

        expect(transferRate.kilobytesPerSecond()).toBe(1500)
        expect(transferRate.megabytesPerSecond()).toBe(1.5)
        expect(transferRate.gigabytesPerSecond()).toBe(0.0015)
        expect(transferRate.terabytesPerSecond()).toBe(0.0000015)
    })

    it('converts to binary byte units per second', () => {
        const transferRate = rate(1.5 * MiBps)

        expect(transferRate.kibibytesPerSecond()).toBe(1536)
        expect(transferRate.mebibytesPerSecond()).toBe(1.5)
        expect(transferRate.gibibytesPerSecond()).toBe(1.5 / 1024)
        expect(transferRate.tebibytesPerSecond()).toBe(1.5 / 1024 / 1024)
    })

    it('converts to bit units per second', () => {
        const transferRate = rate(125 * MBps)

        expect(transferRate.bitsPerSecond()).toBe(1_000_000_000)
        expect(transferRate.kilobitsPerSecond()).toBe(1_000_000)
        expect(transferRate.megabitsPerSecond()).toBe(1000)
        expect(transferRate.gigabitsPerSecond()).toBe(1)
        expect(transferRate.terabitsPerSecond()).toBe(0.001)
    })

    it('formats bytes per second without decimals', () => {
        const transferRate = rate(999)

        expect(transferRate.toString()).toBe('999 B/s')
        expect(transferRate.binaryString()).toBe('999 B/s')
        expect(transferRate.decimalString()).toBe('999 B/s')
    })

    it('formats binary rate by default', () => {
        const transferRate = rate(1536)

        expect(transferRate.toString()).toBe('1.5 KiB/s')
        expect(transferRate.binaryString()).toBe('1.5 KiB/s')
    })

    it('formats decimal rate explicitly', () => {
        const transferRate = rate(1500)

        expect(transferRate.decimalString()).toBe('1.5 KB/s')
    })

    it('formats bit rate explicitly', () => {
        expect(rate(1).bitString()).toBe('8 bps')
        expect(rate(125).bitString()).toBe('1 Kbps')
        expect(rate(125 * 1000).bitString()).toBe('1 Mbps')
        expect(rate(125 * 1000 * 1000).bitString()).toBe('1 Gbps')
        expect(rate(125 * 1000 * 1000 * 1000).bitString()).toBe('1 Tbps')
    })

    it('formats negative values using absolute value for unit selection', () => {
        const transferRate = rate(-1536)

        expect(transferRate.toString()).toBe('-1.5 KiB/s')
        expect(transferRate.decimalString()).toBe('-1.54 KB/s')
        expect(transferRate.bitString()).toBe('-12.29 Kbps')
    })

    it('rejects non-finite values', () => {
        expect(() => rate(Number.NaN)).toThrow(TypeError)
        expect(() => rate(Number.POSITIVE_INFINITY)).toThrow(TypeError)
        expect(() => rate(Number.NEGATIVE_INFINITY)).toThrow(TypeError)
    })

    it('calculates transferred size in duration', () => {
        const transferRate = rate(2 * MiB)

        expect(transferRate.transferredIn(3).bytes()).toBe(6 * MiB)
    })

    it('returns zero transferred size for zero or negative duration', () => {
        const transferRate = rate(2 * MiB)

        expect(transferRate.transferredIn(0).bytes()).toBe(0)
        expect(transferRate.transferredIn(-1).bytes()).toBe(0)
    })
})

describe('perSecond', () => {
    it('calculates rate from size and duration', () => {
        const transferSize = size(10 * MB)

        expect(perSecond(transferSize, 2).bytesPerSecond()).toBe(5 * MB)
    })

    it('truncates fractional bytes per second', () => {
        const transferSize = size(10)

        expect(perSecond(transferSize, 3).bytesPerSecond()).toBe(3)
    })

    it('returns zero rate for zero, negative or non-finite duration', () => {
        const transferSize = size(10 * MB)

        expect(perSecond(transferSize, 0).bytesPerSecond()).toBe(0)
        expect(perSecond(transferSize, -1).bytesPerSecond()).toBe(0)
        expect(perSecond(transferSize, Number.NaN).bytesPerSecond()).toBe(0)
        expect(perSecond(transferSize, Number.POSITIVE_INFINITY).bytesPerSecond()).toBe(0)
        expect(perSecond(transferSize, Number.NEGATIVE_INFINITY).bytesPerSecond()).toBe(0)
    })
})

describe('durationFor', () => {
    it('calculates duration in seconds from size and rate', () => {
        const transferSize = size(10 * MiB)
        const transferRate = rate(25 * MBps)

        expect(durationFor(transferSize, transferRate)).toBe((10 * MiB) / (25 * MBps))
    })

    it('returns zero duration for zero or negative rate', () => {
        const transferSize = size(10 * MiB)

        expect(durationFor(transferSize, rate(0))).toBe(0)
        expect(durationFor(transferSize, rate(-1))).toBe(0)
    })
})

describe('transferredIn', () => {
    it('calculates transferred size from rate and duration', () => {
        const transferRate = rate(25 * MBps)
        const durationSeconds = (10 * MiB) / (25 * MBps)

        expect(transferredIn(transferRate, durationSeconds).bytes()).toBe(10 * MiB)
    })

    it('truncates fractional transferred bytes', () => {
        const transferRate = rate(10)

        expect(transferredIn(transferRate, 0.15).bytes()).toBe(1)
    })

    it('returns zero size for zero, negative or non-finite duration', () => {
        const transferRate = rate(25 * MBps)

        expect(transferredIn(transferRate, 0).bytes()).toBe(0)
        expect(transferredIn(transferRate, -1).bytes()).toBe(0)
        expect(transferredIn(transferRate, Number.NaN).bytes()).toBe(0)
        expect(transferredIn(transferRate, Number.POSITIVE_INFINITY).bytes()).toBe(0)
        expect(transferredIn(transferRate, Number.NEGATIVE_INFINITY).bytes()).toBe(0)
    })
})
