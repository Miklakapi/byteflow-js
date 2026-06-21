import { B, GB, GiB, KB, KiB, MB, MiB, Size, TB, TiB } from './size.js'

const SIZE_PATTERN = /^\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s*$/

const SIZE_UNITS: Readonly<Record<string, number>> = {
    '': B,
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
 * Parses a text value into a Size.
 *
 * Supported units are B, byte, bytes, KB, MB, GB, TB, KiB, MiB, GiB and TiB.
 * Decimal units use base 1000, while binary units use base 1024.
 * Lowercase unit names are accepted.
 *
 * If no unit is provided, the value is treated as bytes.
 * Fractional byte results are truncated.
 *
 * Returns null when the value cannot be parsed.
 */
export function parseSize(value: string): Size | null {
    const match = SIZE_PATTERN.exec(value)

    if (match === null) {
        return null
    }

    const numericPart = match[1]
    const unitPart = match[2] ?? ''
    const numericValue = Number(numericPart)
    const unitValue = SIZE_UNITS[unitPart.toLowerCase()]

    if (!Number.isFinite(numericValue) || unitValue === undefined) {
        return null
    }

    const byteValue = Math.trunc(numericValue * unitValue)

    if (!Number.isSafeInteger(byteValue)) {
        return null
    }

    return new Size(byteValue)
}

/**
 * Parses a text value into a Size.
 *
 * Throws TypeError when the value cannot be parsed.
 */
export function mustParseSize(value: string): Size {
    const parsedSize = parseSize(value)

    if (parsedSize === null) {
        throw new TypeError(`Invalid size: ${value}`)
    }

    return parsedSize
}
