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

export function mustParseRate(value: string): Rate {
    const parsedRate = parseRate(value)

    if (parsedRate === null) {
        throw new TypeError(`Invalid rate: ${value}`)
    }

    return parsedRate
}
