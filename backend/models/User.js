const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,

            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        
        isPremium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "users",
        timestamps: true
    }
);

module.exports = User;