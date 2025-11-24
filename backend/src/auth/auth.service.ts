import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../config/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { UserSeedService } from './user-seed.service';

interface TokenPayload {
  sub: string;
  email: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserWithPassword {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userSeedService: UserSeedService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    // Create sample data for new user (non-blocking)
    this.userSeedService.createSampleData(user.id).catch((error) => {
      console.error('Failed to create sample data for user:', error);
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      return {
        user: this.excludePassword(user),
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.excludePassword(user);
  }

  async updateProfile(
    userId: string,
    dto: { firstName?: string; lastName?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return this.excludePassword(updatedUser);
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Delete user's data in order (to avoid foreign key constraints)
    await this.prisma.$transaction(async (tx) => {
      // Delete notifications
      await tx.notification.deleteMany({ where: { userId } });

      // Delete tasks created by user
      await tx.task.deleteMany({ where: { createdById: userId } });

      // Remove from project members
      await tx.projectMember.deleteMany({ where: { userId } });

      // Delete projects owned by user
      await tx.project.deleteMany({ where: { ownerId: userId } });

      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });

    return { message: 'Account deleted successfully' };
  }

  private async generateTokens(user: UserWithPassword): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 900, // 15 minutes in seconds
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: 604800, // 7 days in seconds
    });

    return { accessToken, refreshToken };
  }

  private excludePassword(user: UserWithPassword) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
