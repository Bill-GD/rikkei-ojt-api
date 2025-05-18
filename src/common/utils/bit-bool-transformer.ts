import { ValueTransformer } from 'typeorm';

export class BitBoolTransformer implements ValueTransformer {
  to(value: boolean | null) {
    if (value === null) return null;

    const res = Buffer.alloc(1);
    res[0] = value ? 1 : 0;
    return res;
  }

  from(value: Buffer) {
    if (value) return value[0] === 1;
    return null;
  }
}
