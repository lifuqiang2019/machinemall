import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'verification_code', nullable: true, type: 'varchar' })
  verificationCode?: string | null; // Allow null to clear code after verification

  @Column({ name: 'verification_code_expires', nullable: true, type: 'timestamp' })
  verificationCodeExpires?: Date | null; // Allow null to clear expiry after verification

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
