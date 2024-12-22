import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Helper {
  generateHash(password: string): string {
    const salt = bcrypt.genSaltSync();
    if (!password || !salt) {
      throw new Error('Password and salt are required');
    }
    return bcrypt.hashSync(password, salt);
  }

  compareHash(string: string, hash: string): boolean {
    return bcrypt.compareSync(string, hash);
  }
}

