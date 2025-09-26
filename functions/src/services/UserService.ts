import {UserRepository} from '../repositories/UserRepository';
import {User, CreateUserRequest, UserResponse} from '../models/User';
import {Timestamp} from '../models/Task';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findOrCreateUser(email: string): Promise<{ user: User; exists: boolean }> {
    if (!this.isValidEmail(email)) {
      throw new Error('formato de correo inválido');
    }

    let user = await this.userRepository.findByEmail(email);
    let exists = true;

    if (!user) {
      const createRequest: CreateUserRequest = {email};
      user = await this.userRepository.create(createRequest);
      exists = false;
    } else {
      await this.userRepository.updateLastLogin(user.id);
    }

    return {user, exists};
  }

  async checkUser(email: string): Promise<boolean> {
    if (!this.isValidEmail(email)) {
      throw new Error('formato de correo inválido');
    }

    const user = await this.userRepository.findByEmail(email);
    const exists = user !== null;

    return exists;
  }

  formatUserResponse(user: User, exists: boolean, token: string): UserResponse {
    return {
      id: user.id,
      email: user.email,
      createdAt: this.transformDate(user.createdAt),
      exists,
      token,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  private transformDate(date: any): string {
    if (isNaN(date)) return '';

    return date instanceof Date ?
      date.toISOString() :
      new Date((date as unknown as Timestamp)._seconds * 1000).toISOString();
  }
}
