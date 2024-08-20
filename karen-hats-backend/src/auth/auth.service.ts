import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUserByCredentials(loginDto.username, loginDto.password);
    const payload: JwtPayload = { username: user.username, sub: user.id.toString() };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // This method validates user by username and password
  async validateUserByCredentials(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // This method validates user by the JWT payload
  async validateUserByPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username: payload.username } });
    if (user) {
      return user;
    }
    throw new UnauthorizedException('User not found');
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !(await compare(changePasswordDto.currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    user.password = changePasswordDto.newPassword;
    return this.userRepository.save(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { resetPasswordToken: resetPasswordDto.token } });
    if (!user) {
      throw new NotFoundException('Invalid token');
    }
    user.password = resetPasswordDto.newPassword;
    user.resetPasswordToken = null;
    return this.userRepository.save(user);
  }
}
