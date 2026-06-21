/**
 * Represents a size unit used for formatting byte values.
 */
export type SizeUnit = {
    readonly value: number
    readonly name: string
}

/**
 * Represents one byte.
 */
export const B = 1

/**
 * Alias for one byte.
 */
export const Byte = B

/**
 * Represents one kibibyte using binary base 1024.
 */
export const KiB = 1024 * Byte

/**
 * Represents one mebibyte using binary base 1024.
 */
export const MiB = 1024 * KiB

/**
 * Represents one gibibyte using binary base 1024.
 */
export const GiB = 1024 * MiB

/**
 * Represents one tebibyte using binary base 1024.
 */
export const TiB = 1024 * GiB

/**
 * Represents one kilobyte using decimal base 1000.
 */
export const KB = 1000 * Byte

/**
 * Represents one megabyte using decimal base 1000.
 */
export const MB = 1000 * KB

/**
 * Represents one gigabyte using decimal base 1000.
 */
export const GB = 1000 * MB

/**
 * Represents one terabyte using decimal base 1000.
 */
export const TB = 1000 * GB

/**
 * Represents a data size in bytes.
 */
export class Size {
    private readonly value: number

    /**
     * Creates a data size from a byte value.
     *
     * Fractional byte values are truncated.
     */
    public constructor(value: number) {
        if (!Number.isFinite(value)) {
            throw new TypeError('Size value must be a finite number')
        }

        this.value = Math.trunc(value)
    }

    /**
     * Returns the raw byte value of the size.
     */
    public bytes(): number {
        return this.value
    }

    /**
     * Returns the size as decimal kilobytes.
     */
    public kilobytes(): number {
        return this.value / KB
    }

    /**
     * Returns the size as decimal megabytes.
     */
    public megabytes(): number {
        return this.value / MB
    }

    /**
     * Returns the size as decimal gigabytes.
     */
    public gigabytes(): number {
        return this.value / GB
    }

    /**
     * Returns the size as decimal terabytes.
     */
    public terabytes(): number {
        return this.value / TB
    }

    /**
     * Returns the size as binary kibibytes.
     */
    public kibibytes(): number {
        return this.value / KiB
    }

    /**
     * Returns the size as binary mebibytes.
     */
    public mebibytes(): number {
        return this.value / MiB
    }

    /**
     * Returns the size as binary gibibytes.
     */
    public gibibytes(): number {
        return this.value / GiB
    }

    /**
     * Returns the size as binary tebibytes.
     */
    public tebibytes(): number {
        return this.value / TiB
    }

    /**
     * Returns the size formatted using binary byte units.
     *
     * The result uses B, KiB, MiB, GiB or TiB depending on the absolute size value.
     * Fractional values are rounded to two decimal places and trailing zeros are removed.
     */
    public binaryString(): string {
        const unit = this.binaryFormatUnit()

        return this.formatWithUnit(unit)
    }

    /**
     * Returns the size formatted using decimal byte units.
     *
     * The result uses B, KB, MB, GB or TB depending on the absolute size value.
     * Fractional values are rounded to two decimal places and trailing zeros are removed.
     */
    public decimalString(): string {
        const unit = this.decimalFormatUnit()

        return this.formatWithUnit(unit)
    }

    /**
     * Returns the size formatted using binary byte units.
     */
    public toString(): string {
        return this.binaryString()
    }

    private binaryFormatUnit(): SizeUnit {
        const absoluteValue = Math.abs(this.value)

        if (absoluteValue >= TiB) {
            return { value: TiB, name: 'TiB' }
        }

        if (absoluteValue >= GiB) {
            return { value: GiB, name: 'GiB' }
        }

        if (absoluteValue >= MiB) {
            return { value: MiB, name: 'MiB' }
        }

        if (absoluteValue >= KiB) {
            return { value: KiB, name: 'KiB' }
        }

        return { value: B, name: 'B' }
    }

    private decimalFormatUnit(): SizeUnit {
        const absoluteValue = Math.abs(this.value)

        if (absoluteValue >= TB) {
            return { value: TB, name: 'TB' }
        }

        if (absoluteValue >= GB) {
            return { value: GB, name: 'GB' }
        }

        if (absoluteValue >= MB) {
            return { value: MB, name: 'MB' }
        }

        if (absoluteValue >= KB) {
            return { value: KB, name: 'KB' }
        }

        return { value: B, name: 'B' }
    }

    private formatWithUnit(unit: SizeUnit): string {
        if (unit.name === 'B') {
            return `${this.value} ${unit.name}`
        }

        const formattedValue = formatFloat(this.value / unit.value)

        return `${formattedValue} ${unit.name}`
    }
}

/**
 * Creates a Size from a byte value.
 *
 * Fractional byte values are truncated.
 */
export function size(value: number): Size {
    return new Size(value)
}

/**
 * Creates a Size from a raw byte value.
 *
 * Fractional byte values are truncated.
 */
export function bytes(value: number): Size {
    return new Size(value)
}

function formatFloat(value: number): string {
    return value.toFixed(2).replace(/\.?0+$/, '')
}
