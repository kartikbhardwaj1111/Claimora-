import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string, role: 'patient' | 'insurer') {
    const existing = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });
    await user.save();

    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role });
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role });
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async demoLogin(role: 'patient' | 'insurer') {
    const email = role === 'patient' ? 'patient@aarogya.com' : 'insurer@aarogya.com';
    const name = role === 'patient' ? 'Rahul Sharma (Patient)' : 'Sonali D (Insurer Admin)';

    let user = await this.userModel.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash('demo123', 10);
      user = new this.userModel({ name, email, passwordHash, role });
      await user.save();
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role });
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
