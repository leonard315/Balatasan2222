

      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export const User = sequelize.define("User", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name is required" },
      len: { args: [2, 100], msg: "Name must be between 2 and 100 characters" }
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: { msg: "Email already registered" },
    validate: {
      isEmail: { msg: "Invalid email format" },
      notEmpty: { msg: "Email is required" }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: { 
        args: /^(\+63|0)?[0-9]{10}$/,
        msg: "Invalid Philippine phone number format (e.g., 09171234567)"
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password is required" },
      len: { args: [8, 100], msg: "Password must be at least 8 characters" }
    }
  },
  role: {
    type: DataTypes.ENUM('guest', 'staff', 'admin'),
    defaultValue: 'guest',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});
export { sequelize }; 
