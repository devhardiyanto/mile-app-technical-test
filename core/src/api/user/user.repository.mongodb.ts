import { UserModel, type IUser } from '@/database/mongodb/models';

export class UserMongoDBRepository {
  async findAllAsync(): Promise<IUser[]> {
    return await UserModel.find().exec();
  }

  async findByIdAsync(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).exec();
  }

  async findByEmailAsync(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async createAsync(data: { name: string; email: string; password: string }): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async updateAsync(
    id: string,
    data: Partial<{ name: string; email: string; password: string }>
  ): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteAsync(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
