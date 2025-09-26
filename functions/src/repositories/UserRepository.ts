import {db} from '../config/firebase';
import {User, CreateUserRequest} from '../models/User';

const USERS_COLLECTION = 'Users';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.collection(USERS_COLLECTION)
          .where('email', '==', email.toLowerCase()).limit(1)
          .get();

      if (user.empty) return null;

      const doc = user.docs[0];
      if (!doc) return null;

      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      console.log(error);
      throw new Error('Error al buscar el usuario por medio de su correo electrónico');
    }
  }

  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const userRecord = {
        email: userData.email.toLowerCase(),
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      const docRef = await db.collection(USERS_COLLECTION).add(userRecord);

      return {
        id: docRef.id,
        ...userRecord,
      } as User;
    } catch (error) {
      throw new Error('Error al crear el usuario');
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await db.collection(USERS_COLLECTION).doc(userId).update({
        lastLogin: new Date(),
      });
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }
}
