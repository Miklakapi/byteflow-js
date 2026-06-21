# byteflow

Small TypeScript library for working with data sizes and transfer rates.

## Installation

```bash
npm install @miklakapi/byteflow
```

## Size

```ts
import { KiB, size } from '@miklakapi/byteflow'

const fileSize = size(1536 * KiB)

console.log(fileSize.toString()) // 1.5 MiB
console.log(fileSize.binaryString()) // 1.5 MiB
console.log(fileSize.decimalString()) // 1.57 MB
console.log(fileSize.bytes()) // 1572864
console.log(fileSize.mebibytes()) // 1.5
```

You can also create a size from a raw byte value:

```ts
import { bytes } from '@miklakapi/byteflow'

const fileSize = bytes(1536)

console.log(fileSize.toString()) // 1.5 KiB
```

## Rate

```ts
import { MiB, perSecond, size } from '@miklakapi/byteflow'

const transferSize = size(750 * MiB)
const durationSeconds = 3

const transferRate = perSecond(transferSize, durationSeconds)

console.log(transferRate.toString()) // 250 MiB/s
console.log(transferRate.decimalString()) // 262.14 MB/s
console.log(transferRate.bytesPerSecond()) // 262144000
```

You can also work with bit rates:

```ts
import { MBps, rate } from '@miklakapi/byteflow'

const transferRate = rate(125 * MBps)

console.log(transferRate.bitString()) // 1 Gbps
console.log(transferRate.bitsPerSecond()) // 1000000000
console.log(transferRate.megabitsPerSecond()) // 1000
```

## Parsing

```ts
import { parseRate, parseSize } from '@miklakapi/byteflow'

const fileSize = parseSize('1.5 MiB')
const transferRate = parseRate('250 MiB/s')

if (fileSize === null) {
    throw new Error('Invalid size')
}

if (transferRate === null) {
    throw new Error('Invalid rate')
}

console.log(fileSize.toString()) // 1.5 MiB
console.log(transferRate.toString()) // 250 MiB/s
```

## Must parse helpers

```ts
import { mustParseRate, mustParseSize } from '@miklakapi/byteflow'

const fileSize = mustParseSize('10 MiB')
const transferRate = mustParseRate('25 MBps')

console.log(fileSize.toString()) // 10 MiB
console.log(transferRate.toString()) // 23.84 MiB/s
```

`mustParseSize()` and `mustParseRate()` throw `TypeError` when the value cannot be parsed.

## Helpers

```ts
import { durationFor, mustParseRate, mustParseSize, transferredIn } from '@miklakapi/byteflow'

const fileSize = mustParseSize('10 MiB')
const transferRate = mustParseRate('25 MBps')

const durationSeconds = durationFor(fileSize, transferRate)
const transferredSize = transferredIn(transferRate, durationSeconds)

console.log(durationSeconds) // 0.4194304
console.log(transferredSize.toString()) // 10 MiB
```

## Units

Binary size units:

```ts
import { GiB, KiB, MiB, TiB } from '@miklakapi/byteflow'
```

Decimal size units:

```ts
import { GB, KB, MB, TB } from '@miklakapi/byteflow'
```

Transfer rate units:

```ts
import {
    GBps,
    GiBps,
    KBps,
    KiBps,
    MBps,
    MiBps,
    TBps,
    TiBps,
} from '@miklakapi/byteflow'
```

Raw byte units:

```ts
import { B, Bps, Byte, BytePerSecond } from '@miklakapi/byteflow'
```

## Supported size parsing

`parseSize()` and `mustParseSize()` support:

```txt
B
byte
bytes

KB
MB
GB
TB

KiB
MiB
GiB
TiB
```

Lowercase unit names are also accepted:

```ts
parseSize('1 mb')
parseSize('1 mib')
```

If no unit is provided, bytes are used:

```ts
parseSize('10')?.bytes() // 10
```

Fractional byte results are truncated:

```ts
parseSize('1.9 B')?.bytes() // 1
```

## Supported rate parsing

`parseRate()` and `mustParseRate()` support slash-based units:

```txt
B/s
byte/s
bytes/s

KB/s
MB/s
GB/s
TB/s

KiB/s
MiB/s
GiB/s
TiB/s
```

Lowercase slash-based units are also accepted:

```ts
parseRate('1 mb/s')
parseRate('1 mib/s')
```

Compact `ps` units are also supported:

```txt
Bps
KBps
MBps
GBps
TBps

KiBps
MiBps
GiBps
TiBps
```

Lowercase compact non-byte units are intentionally not accepted:

```ts
parseRate('1 MBps') // OK
parseRate('1 mbps') // null
```

This avoids confusing byte-based `MBps` with bit-based `Mbps`.

## Notes

`toString()` uses binary byte units by default.

```ts
import { B, size } from '@miklakapi/byteflow'

console.log(size(1536 * B).toString()) // 1.5 KiB
```

Use `decimalString()` for decimal byte units.

```ts
import { B, size } from '@miklakapi/byteflow'

console.log(size(1500 * B).decimalString()) // 1.5 KB
```

Durations are represented as seconds.

```ts
durationFor(mustParseSize('10 MiB'), mustParseRate('25 MBps')) // 0.4194304
```

Invalid or non-positive durations return zero values in helper functions, matching the behavior of the Go version.

```ts
perSecond(mustParseSize('10 MiB'), 0).bytesPerSecond() // 0
transferredIn(mustParseRate('25 MBps'), 0).bytes() // 0
```
