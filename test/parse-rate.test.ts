import { describe, expect, it } from 'vitest'

import { GBps, GiBps, KBps, KiBps, MBps, MiBps, TBps, TiBps, mustParseRate, parseRate } from '../src/index.js'

describe('parseRate', () => {
    it('parses slash-based byte units per second', () => {
        expect(parseRate('10 B/s')?.bytesPerSecond()).toBe(10)
        expect(parseRate('10 byte/s')?.bytesPerSecond()).toBe(10)
        expect(parseRate('10 bytes/s')?.bytesPerSecond()).toBe(10)
    })

    it('parses slash-based decimal units per second', () => {
        expect(parseRate('1 KB/s')?.bytesPerSecond()).toBe(KBps)
        expect(parseRate('1.5 MB/s')?.bytesPerSecond()).toBe(1.5 * MBps)
        expect(parseRate('2 GB/s')?.bytesPerSecond()).toBe(2 * GBps)
        expect(parseRate('3 TB/s')?.bytesPerSecond()).toBe(3 * TBps)
    })

    it('parses slash-based binary units per second', () => {
        expect(parseRate('1 KiB/s')?.bytesPerSecond()).toBe(KiBps)
        expect(parseRate('1.5 MiB/s')?.bytesPerSecond()).toBe(1.5 * MiBps)
        expect(parseRate('2 GiB/s')?.bytesPerSecond()).toBe(2 * GiBps)
        expect(parseRate('3 TiB/s')?.bytesPerSecond()).toBe(3 * TiBps)
    })

    it('parses slash-based units with spaces around slash suffix', () => {
        expect(parseRate('1 MB / s')?.bytesPerSecond()).toBe(MBps)
        expect(parseRate('1 MiB/ s')?.bytesPerSecond()).toBe(MiBps)
        expect(parseRate('1 GiB /s')?.bytesPerSecond()).toBe(GiBps)
    })

    it('parses lowercase slash-based units', () => {
        expect(parseRate('1 kb/s')?.bytesPerSecond()).toBe(KBps)
        expect(parseRate('1 mb/s')?.bytesPerSecond()).toBe(MBps)
        expect(parseRate('1 gb/s')?.bytesPerSecond()).toBe(GBps)
        expect(parseRate('1 tb/s')?.bytesPerSecond()).toBe(TBps)

        expect(parseRate('1 kib/s')?.bytesPerSecond()).toBe(KiBps)
        expect(parseRate('1 mib/s')?.bytesPerSecond()).toBe(MiBps)
        expect(parseRate('1 gib/s')?.bytesPerSecond()).toBe(GiBps)
        expect(parseRate('1 tib/s')?.bytesPerSecond()).toBe(TiBps)
    })

    it('parses compact decimal units per second', () => {
        expect(parseRate('1 KBps')?.bytesPerSecond()).toBe(KBps)
        expect(parseRate('1.5 MBps')?.bytesPerSecond()).toBe(1.5 * MBps)
        expect(parseRate('2 GBps')?.bytesPerSecond()).toBe(2 * GBps)
        expect(parseRate('3 TBps')?.bytesPerSecond()).toBe(3 * TBps)
    })

    it('parses compact binary units per second', () => {
        expect(parseRate('1 KiBps')?.bytesPerSecond()).toBe(KiBps)
        expect(parseRate('1.5 MiBps')?.bytesPerSecond()).toBe(1.5 * MiBps)
        expect(parseRate('2 GiBps')?.bytesPerSecond()).toBe(2 * GiBps)
        expect(parseRate('3 TiBps')?.bytesPerSecond()).toBe(3 * TiBps)
    })

    it('parses compact bytes per second', () => {
        expect(parseRate('10 Bps')?.bytesPerSecond()).toBe(10)
    })

    it('rejects lowercase compact non-byte units', () => {
        expect(parseRate('1 bps')).toBeNull()
        expect(parseRate('1 kbps')).toBeNull()
        expect(parseRate('1 mbps')).toBeNull()
        expect(parseRate('1 gbps')).toBeNull()
        expect(parseRate('1 tbps')).toBeNull()

        expect(parseRate('1 kibps')).toBeNull()
        expect(parseRate('1 mibps')).toBeNull()
        expect(parseRate('1 gibps')).toBeNull()
        expect(parseRate('1 tibps')).toBeNull()
    })

    it('truncates fractional bytes per second', () => {
        expect(parseRate('1.5 B/s')?.bytesPerSecond()).toBe(1)
        expect(parseRate('1.9 B/s')?.bytesPerSecond()).toBe(1)
        expect(parseRate('0.9 B/s')?.bytesPerSecond()).toBe(0)
    })

    it('rejects values without rate suffix', () => {
        expect(parseRate('10')).toBeNull()
        expect(parseRate('10 MB')).toBeNull()
        expect(parseRate('10 MiB')).toBeNull()
    })

    it('rejects signed values', () => {
        expect(parseRate('-1 MB/s')).toBeNull()
        expect(parseRate('+1 MB/s')).toBeNull()
    })

    it('returns null for invalid values', () => {
        expect(parseRate('')).toBeNull()
        expect(parseRate('abc')).toBeNull()
        expect(parseRate('MB/s')).toBeNull()
        expect(parseRate('10 XB/s')).toBeNull()
        expect(parseRate('10 XBps')).toBeNull()
        expect(parseRate('Infinity MB/s')).toBeNull()
        expect(parseRate('NaN MB/s')).toBeNull()
    })

    it('returns null for unsafe integer results', () => {
        expect(parseRate(`${Number.MAX_SAFE_INTEGER} TB/s`)).toBeNull()
    })
})

describe('mustParseRate', () => {
    it('returns parsed slash-based rate', () => {
        expect(mustParseRate('1.5 MiB/s').bytesPerSecond()).toBe(1.5 * MiBps)
    })

    it('returns parsed compact rate', () => {
        expect(mustParseRate('1.5 MiBps').bytesPerSecond()).toBe(1.5 * MiBps)
    })

    it('throws for invalid values', () => {
        expect(() => mustParseRate('abc')).toThrow(TypeError)
        expect(() => mustParseRate('10 XB/s')).toThrow(TypeError)
        expect(() => mustParseRate('-1 MB/s')).toThrow(TypeError)
        expect(() => mustParseRate('1 mbps')).toThrow(TypeError)
    })
})
