import { B, GB, GiB, KB, KiB, MB, MiB, Size, TB, TiB } from './size.js'

/**
 * Represents a rate unit used for formatting transfer rates.
 */
export type RateUnit = {
    readonly value: number
    readonly name: string
}

const BIT_PER_BYTE = 8

const KILOBIT = 1000
const MEGABIT = 1000 * KILOBIT
const GIGABIT = 1000 * MEGABIT
const TERABIT = 1000 * GIGABIT

/**
 * Represents one byte per second.
 */
export const Bps = B

/**
 * Alias for one byte per second.
 */
export const BytePerSecond = Bps

/**
 * Represents one kibibyte per second using binary base 1024.
 */
export const KiBps = KiB

/**
 * Represents one mebibyte per second using binary base 1024.
 */
export const MiBps = MiB

/**
 * Represents one gibibyte per second using binary base 1024.
 */
export const GiBps = GiB

/**
 * Represents one tebibyte per second using binary base 1024.
 */
export const TiBps = TiB

/**
 * Represents one kilobyte per second using decimal base 1000.
 */
export const KBps = KB

/**
 * Represents one megabyte per second using decimal base 1000.
 */
export const MBps = MB

/**
 * Represents one gigabyte per second using decimal base 1000.
 */
export const GBps = GB

/**
 * Represents one terabyte per second using decimal base 1000.
 */
export const TBps = TB

/**
 * Represents a data transfer rate in bytes per second.
 */
export class Rate {
    private readonly value: number

    /**
     * Creates a transfer rate from a bytes-per-second value.
     *
     * Fractional bytes-per-second values are truncated.
     */
    public constructor(value: number) {
        if (!Number.isFinite(value)) {
            throw new TypeError('Rate value must be a finite number')
        }

        this.value = Math.trunc(value)
    }

    /**
     * Returns the raw bytes-per-second value of the rate.
     */
    public bytesPerSecond(): number {
        return this.value
    }

    /**
     * Returns the rate as decimal kilobytes per second.
     */
    public kilobytesPerSecond(): number {
        return this.value / KBps
    }

    /**
     * Returns the rate as decimal megabytes per second.
     */
    public megabytesPerSecond(): number {
        return this.value / MBps
    }

    /**
     * Returns the rate as decimal gigabytes per second.
     */
    public gigabytesPerSecond(): number {
        return this.value / GBps
    }

    /**
     * Returns the rate as decimal terabytes per second.
     */
    public terabytesPerSecond(): number {
        return this.value / TBps
    }

    /**
     * Returns the rate as binary kibibytes per second.
     */
    public kibibytesPerSecond(): number {
        return this.value / KiBps
    }

    /**
     * Returns the rate as binary mebibytes per second.
     */
    public mebibytesPerSecond(): number {
        return this.value / MiBps
    }

    /**
     * Returns the rate as binary gibibytes per second.
     */
    public gibibytesPerSecond(): number {
        return this.value / GiBps
    }

    /**
     * Returns the rate as binary tebibytes per second.
     */
    public tebibytesPerSecond(): number {
        return this.value / TiBps
    }

    /**
     * Returns the rate as bits per second.
     */
    public bitsPerSecond(): number {
        return this.value * BIT_PER_BYTE
    }

    /**
     * Returns the rate as decimal kilobits per second.
     */
    public kilobitsPerSecond(): number {
        return this.bitsPerSecond() / KILOBIT
    }

    /**
     * Returns the rate as decimal megabits per second.
     */
    public megabitsPerSecond(): number {
        return this.bitsPerSecond() / MEGABIT
    }

    /**
     * Returns the rate as decimal gigabits per second.
     */
    public gigabitsPerSecond(): number {
        return this.bitsPerSecond() / GIGABIT
    }

    /**
     * Returns the rate as decimal terabits per second.
     */
    public terabitsPerSecond(): number {
        return this.bitsPerSecond() / TERABIT
    }

    /**
     * Calculates how much data can be transferred at this rate in the given duration.
     *
     * Duration is represented in seconds.
     * If duration is zero, negative or not finite, it returns zero bytes.
     */
    public transferredIn(durationSeconds: number): Size {
        return transferredIn(this, durationSeconds)
    }

    /**
     * Returns the rate formatted using binary byte units per second.
     *
     * The result uses B/s, KiB/s, MiB/s, GiB/s or TiB/s depending on the absolute rate value.
     * Fractional values are rounded to two decimal places and trailing zeros are removed.
     */
    public binaryString(): string {
        const size = new Size(this.value)

        return `${size.binaryString()}/s`
    }

    /**
     * Returns the rate formatted using decimal byte units per second.
     *
     * The result uses B/s, KB/s, MB/s, GB/s or TB/s depending on the absolute rate value.
     * Fractional values are rounded to two decimal places and trailing zeros are removed.
     */
    public decimalString(): string {
        const size = new Size(this.value)

        return `${size.decimalString()}/s`
    }

    /**
     * Returns the rate formatted using decimal bit units per second.
     *
     * The result uses bps, Kbps, Mbps, Gbps or Tbps depending on the absolute bit rate value.
     * Fractional values are rounded to two decimal places and trailing zeros are removed.
     */
    public bitString(): string {
        const unit = this.bitFormatUnit()

        if (unit.name === 'bps') {
            return `${formatFloat(this.bitsPerSecond())} ${unit.name}`
        }

        const formattedValue = formatFloat(this.bitsPerSecond() / unit.value)

        return `${formattedValue} ${unit.name}`
    }

    /**
     * Returns the rate formatted using binary byte units per second.
     */
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

/**
 * Creates a Rate from a bytes-per-second value.
 *
 * Fractional bytes-per-second values are truncated.
 */
export function rate(value: number): Rate {
    return new Rate(value)
}

/**
 * Creates a Rate from a raw bytes-per-second value.
 *
 * Fractional bytes-per-second values are truncated.
 */
export function bytesPerSecond(value: number): Rate {
    return new Rate(value)
}

/**
 * Calculates the transfer rate for a given size and duration.
 *
 * Duration is represented in seconds.
 * If duration is zero, negative or not finite, it returns zero bytes per second.
 */
export function perSecond(size: Size, durationSeconds: number): Rate {
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        return new Rate(0)
    }

    const bytesPerSecond = size.bytes() / durationSeconds

    return new Rate(bytesPerSecond)
}

/**
 * Calculates the duration needed to transfer a given size at a given rate.
 *
 * The returned duration is represented in seconds.
 * If rate is zero or negative, it returns zero.
 */
export function durationFor(size: Size, rate: Rate): number {
    if (rate.bytesPerSecond() <= 0) {
        return 0
    }

    return size.bytes() / rate.bytesPerSecond()
}

/**
 * Calculates how much data can be transferred at a given rate and duration.
 *
 * Duration is represented in seconds.
 * If duration is zero, negative or not finite, it returns zero bytes.
 */
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
