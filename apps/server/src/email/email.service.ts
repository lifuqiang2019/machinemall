import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const transportConfig: any = {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      requireTLS: this.configService.get<string>('SMTP_REQUIRE_TLS') === 'true',
      // Increase timeouts
      connectionTimeout: 30000, 
      socketTimeout: 30000,
    };

    this.transporter = nodemailer.createTransport(transportConfig);
  }

  async sendVerificationCode(email: string, code: string) {
    const from = this.configService.get<string>('SMTP_FROM');
    const mailOptions = {
      from: `"Machmall Support" <${from}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0154A6;">Verification Code</h2>
          <p>You are registering for Machmall. Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; background: #f5f5f5; padding: 10px; display: inline-block; border-radius: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification code sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
