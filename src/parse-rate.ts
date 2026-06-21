import { Rate } from './rate.js'
import { B, GB, GiB, KB, KiB, MB, MiB, TB, TiB } from './size.js'

const RATE_PATTERN = /^\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*(?:(\/\s*s)|(ps))\s*$/

const RATE_UNITS: Readonly<Record<string, number>> = {
    b: B,
    byte: B,
    bytes: B,

    kb: KB,
    mb: MB,
    gb: GB,
    tb: TB,

    kib: KiB,
    mib: MiB,
    gib: GiB,
    tib: TiB,
}

/**
 * Parses a text value into a Rate.
 *
 * Supported slash-based units are B/s, byte/s, bytes/s, KB/s, MB/s, GB/s, TB/s,
 * KiB/s, MiB/s, GiB/s and TiB/s.
 *
 * Supported compact units are Bps, KBps, MBps, GBps, TBps,
 * KiBps, MiBps, GiBps and TiBps.
 *
 * Decimal units use base 1000, while binary units use base 1024.
 * Lowercase slash-based unit names are accepted.
 *
 * Lowercase compact non-byte units are not accepted to avoid confusing byte-based
 * units such as MBps with bit-based units such as Mbps.
 *
 * Fractional bytes-per-second results are truncated.
 *
 * Returns null when the value cannot be parsed.
 */
export function parseRate(value: string): Rate | null {
    const match = RATE_PATTERN.exec(value)

    if (match === null) {
        return null
    }

    const numericPart = match[1]
    const unitPart = match[2] ?? ''
    const compactSuffix = match[4]
    const numericValue = Number(numericPart)
    const unitName = unitPart.toLowerCase()
    const unitValue = RATE_UNITS[unitName]

    if (!Number.isFinite(numericValue) || unitValue === undefined) {
        return null
    }

    if (compactSuffix === 'ps' && unitPart !== 'B' && unitPart.toLowerCase() === unitPart) {
        return null
    }

    const byteValue = Math.trunc(numericValue * unitValue)

    if (!Number.isSafeInteger(byteValue)) {
        return null
    }

    return new Rate(byteValue)
}

/**
 * Parses a text value into a Rate.
 *
 * Throws TypeError when the value cannot be parsed.
 */
export function mustParseRate(value: string): Rate {
    const parsedRate = parseRate(value)

    if (parsedRate === null) {
        throw new TypeError(`Invalid rate: ${value}`)
    }

    return parsedRate
}
