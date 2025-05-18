import { ValueTransformer } from 'typeorm';

export class BitBoolTransformer implements ValueTransformer {
  to(value: boolean) {
    if (value) {
      const res = Buffer.alloc(1);
      res[0] = value ? 1 : 0;
      return res;
    }
    return null;
  }

  from(value: Buffer) {
    if (value) return value[0] === 1;
    return null;
  }
}
