import { db } from '../database/db';
import { hashPassword, seedDatabaseIfEmpty } from '../database/seed';
import type { UserProfile, UserRole } from '../../types';

const SESSION_KEY = 'heatguard_session_user_id';

export interface LoginResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  jobTitle?: string;
}

export class AuthService {
  // Ensure database is initialized and seeded before operation
  static async init(): Promise<void> {
    await seedDatabaseIfEmpty();
  }

  static async login(email: string, password: string): Promise<LoginResult> {
    await this.init();
    try {
      const users = await db.getAll('users');
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return { success: false, error: 'No account found with this email address.' };
      }

      const inputHash = await hashPassword(password);
      if (user.passwordHash !== inputHash) {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }

      // Remove passwordHash from session representation
      const { passwordHash: _, ...profile } = user;
      localStorage.setItem(SESSION_KEY, profile.id);

      return { success: true, user: profile };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed due to unexpected error.';
      return { success: false, error: errorMsg };
    }
  }

  static async register(params: RegisterParams): Promise<LoginResult> {
    await this.init();
    try {
      const normalizedEmail = params.email.trim().toLowerCase();
      
      // Basic validation
      if (!params.name.trim() || params.name.length < 2) {
        return { success: false, error: 'Please enter a valid full name.' };
      }
      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!params.password || params.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const users = await db.getAll('users');
      const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
      if (exists) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newId = `usr-${Date.now()}`;
      const passwordHash = await hashPassword(params.password);
      const now = new Date().toISOString();

      const newUser: UserProfile & { passwordHash: string } = {
        id: newId,
        email: normalizedEmail,
        name: params.name.trim(),
        role: params.role || 'USER',
        department: params.department || 'Operations',
        jobTitle: params.jobTitle || 'Field Specialist',
        createdAt: now,
        updatedAt: now,
        passwordHash
      };

      await db.put('users', newUser);

      // Create initial device record
      await db.put('devices', {
        id: `dev-${newId}`,
        userId: newId,
        deviceSerial: `HG-EDGE-${Math.floor(1000 + Math.random() * 9000)}`,
        model: 'HeatGuard Pro Band (Edge v2.4)',
        firmwareVersion: 'v2.4.1',
        batteryLevel: 85,
        connectionStatus: 'CONNECTED',
        lastSyncTime: now,
        sensors: {
          max30102: { name: 'Photoplethysmography (MAX30102)', status: 'ACTIVE', lastReading: '80 BPM / 98% SpO2' },
          mlx90614: { name: 'Infrared Thermometer (MLX90614)', status: 'ACTIVE', lastReading: '36.6 °C' },
          sht31: { name: 'Ambient Temp & RH (SHT31)', status: 'ACTIVE', lastReading: '31.2 °C / 50% RH' },
          mpu6050: { name: '6-Axis IMU (MPU6050)', status: 'ACTIVE', lastReading: 'Moderate Motion' }
        }
      });

      // Auto-assign to default manager if it's a regular user
      if (newUser.role === 'USER') {
        await db.put('manager_user_assignments', {
          id: `mua-${newId}`,
          managerId: 'mgr-rachel',
          userId: newId,
          assignedAt: now
        });
      }

      const { passwordHash: _, ...profile } = newUser;
      localStorage.setItem(SESSION_KEY, profile.id);

      return { success: true, user: profile };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed.';
      return { success: false, error: errorMsg };
    }
  }

  static async getCurrentUser(): Promise<UserProfile | null> {
    await this.init();
    try {
      const userId = localStorage.getItem(SESSION_KEY);
      if (!userId) return null;

      const user = await db.getById('users', userId);
      if (!user) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      const { passwordHash: _, ...profile } = user;
      return profile;
    } catch (err) {
      console.error('Error fetching current user:', err);
      return null;
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  }

  static async updateUserProfile(updated: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
    const existing = await db.getById('users', updated.id);
    if (!existing) throw new Error('User not found');

    const merged = {
      ...existing,
      ...updated,
      updatedAt: new Date().toISOString()
    };

    await db.put('users', merged);
    const { passwordHash: _, ...profile } = merged;
    return profile;
  }
}
