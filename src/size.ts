export type SizeUnit = {
    readonly value: number
    readonly name: string
}

export const B = 1
export const Byte = B

export const KiB = 1024 * Byte
export const MiB = 1024 * KiB
export const GiB = 1024 * MiB
export const TiB = 1024 * GiB

export const KB = 1000 * Byte
export const MB = 1000 * KB
export const GB = 1000 * MB
export const TB = 1000 * GB

export class Size {
    private readonly value: number

    public constructor(value: number) {
        if (!Number.isFinite(value)) {
            throw new TypeError('Size value must be a finite number')
        }

        this.value = value
    }

    public bytes(): number {
        return this.value
    }

    public kilobytes(): number {
        return this.value / KB
    }

    public megabytes(): number {
        return this.value / MB
    }

    public gigabytes(): number {
        return this.value / GB
    }

    public terabytes(): number {
        return this.value / TB
    }

    public kibibytes(): number {
        return this.value / KiB
    }

    public mebibytes(): number {
        return this.value / MiB
    }

    public gibibytes(): number {
        return this.value / GiB
    }

    public tebibytes(): number {
        return this.value / TiB
    }

    public binaryString(): string {
        const unit = this.binaryFormatUnit()

        return this.formatWithUnit(unit)
    }

    public decimalString(): string {
        const unit = this.decimalFormatUnit()

        return this.formatWithUnit(unit)
    }

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

export function size(value: number): Size {
    return new Size(value)
}

export function bytes(value: number): Size {
    return new Size(value)
}

function formatFloat(value: number): string {
    return value.toFixed(2).replace(/\.?0+$/, '')
}
