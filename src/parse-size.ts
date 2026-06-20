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

export function mustParseSize(value: string): Size {
    const parsedSize = parseSize(value)

    if (parsedSize === null) {
        throw new TypeError(`Invalid size: ${value}`)
    }

    return parsedSize
}
