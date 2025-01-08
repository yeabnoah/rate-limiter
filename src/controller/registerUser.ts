import { UserModel } from '../models/User';
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email and password are required'
        });
      }
  
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email already registered'
        });
      }
  
      const user = new UserModel({ email, password });
      await user.save();
  
      res.status(201).json({
        message: 'User registered successfully',
        apiKey: user.apiKey
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during registration'
      });
    }
  }