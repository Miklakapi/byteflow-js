import { B, GB, GiB, KB, KiB, MB, MiB, Size, TB, TiB } from './size.js'

export type RateUnit = {
    readonly value: number
    readonly name: string
}

const BIT_PER_BYTE = 8

const KILOBIT = 1000
const MEGABIT = 1000 * KILOBIT
const GIGABIT = 1000 * MEGABIT
const TERABIT = 1000 * GIGABIT

export const Bps = B
export const BytePerSecond = Bps

export const KiBps = KiB
export const MiBps = MiB
export const GiBps = GiB
export const TiBps = TiB

export const KBps = KB
export const MBps = MB
export const GBps = GB
export const TBps = TB

export class Rate {
    private readonly value: number

    public constructor(value: number) {
        if (!Number.isFinite(value)) {
            throw new TypeError('Rate value must be a finite number')
        }

        this.value = Math.trunc(value)
    }

    public bytesPerSecond(): number {
        return this.value
    }

    public kilobytesPerSecond(): number {
        return this.value / KBps
    }

    public megabytesPerSecond(): number {
        return this.value / MBps
    }

    public gigabytesPerSecond(): number {
        return this.value / GBps
    }

    public terabytesPerSecond(): number {
        return this.value / TBps
    }

    public kibibytesPerSecond(): number {
        return this.value / KiBps
    }

    public mebibytesPerSecond(): number {
        return this.value / MiBps
    }

    public gibibytesPerSecond(): number {
        return this.value / GiBps
    }

    public tebibytesPerSecond(): number {
        return this.value / TiBps
    }

    public bitsPerSecond(): number {
        return this.value * BIT_PER_BYTE
    }

    public kilobitsPerSecond(): number {
        return this.bitsPerSecond() / KILOBIT
    }

    public megabitsPerSecond(): number {
        return this.bitsPerSecond() / MEGABIT
    }

    public gigabitsPerSecond(): number {
        return this.bitsPerSecond() / GIGABIT
    }

    public terabitsPerSecond(): number {
        return this.bitsPerSecond() / TERABIT
    }

    public transferredIn(durationSeconds: number): Size {
        return transferredIn(this, durationSeconds)
    }

    public binaryString(): string {
        const size = new Size(this.value)

        return `${size.binaryString()}/s`
    }

    public decimalString(): string {
        const size = new Size(this.value)

        return `${size.decimalString()}/s`
    }

    public bitString(): string {
        const unit = this.bitFormatUnit()

        if (unit.name === 'bps') {
            return `${formatFloat(this.bitsPerSecond())} ${unit.name}`
        }

        const formattedValue = formatFloat(this.bitsPerSecond() / unit.value)

        return `${formattedValue} ${unit.name}`
    }

    public toString(): string {
        return this.binaryString()
    }

    private bitFormatUnit(): RateUnit {
        const absoluteBitsPerSecond = this.absoluteBitsPerSecond()

        if (absoluteBitsPerSecond >= TERABIT) {
            return { value: TERABIT, name: 'Tbps' }
        }

        if (absoluteBitsPerSecond >= GIGABIT) {
            return { value: GIGABIT, name: 'Gbps' }
        }

        if (absoluteBitsPerSecond >= MEGABIT) {
            return { value: MEGABIT, name: 'Mbps' }
        }

        if (absoluteBitsPerSecond >= KILOBIT) {
            return { value: KILOBIT, name: 'Kbps' }
        }

        return { value: 1, name: 'bps' }
    }

    private absoluteBitsPerSecond(): number {
        const bitsPerSecond = this.bitsPerSecond()

        if (bitsPerSecond < 0) {
            return -bitsPerSecond
        }

        return bitsPerSecond
    }
}

export function rate(value: number): Rate {
    return new Rate(value)
}

export function bytesPerSecond(value: number): Rate {
    return new Rate(value)
}

export function perSecond(size: Size, durationSeconds: number): Rate {
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        return new Rate(0)
    }

    const bytesPerSecond = size.bytes() / durationSeconds

    return new Rate(bytesPerSecond)
}

export function durationFor(size: Size, rate: Rate): number {
    if (rate.bytesPerSecond() <= 0) {
        return 0
    }

    return size.bytes() / rate.bytesPerSecond()
}

export function transferredIn(rate: Rate, durationSeconds: number): Size {
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        return new Size(0)
    }

    const bytesTransferred = rate.bytesPerSecond() * durationSeconds

    return new Size(bytesTransferred)
}

function formatFloat(value: number): string {
    return value.toFixed(2).replace(/\.?0+$/, '')
}
