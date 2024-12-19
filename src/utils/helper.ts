import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Helper {
  generateHash(password: string): string {
    const genSalt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, genSalt);
  }

  compareHash(string: string, hash: string): boolean {
    const result = bcrypt.compareSync(string, hash);
    return result;
  }
}
