import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
export class User extends Model {
    // Hash the password before saving the user
    async setPassword(password) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(password, saltRounds);
    }
    // Compare password for login
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}
export function UserFactory(sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                await user.setPassword(user.password); // Automatically hash password on create
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    await user.setPassword(user.password); // Hash password on update if it changes
                }
            },
        }
    });
    return User;
}
