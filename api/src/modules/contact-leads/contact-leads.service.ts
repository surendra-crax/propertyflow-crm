import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactLeadsService {
    private readonly logger = new Logger(ContactLeadsService.name);
    private transporter: nodemailer.Transporter;

    constructor(private prisma: PrismaService) {
        // Initialize Nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async create(data: { name: string; company?: string; email: string; phone: string; teamSize?: string; message?: string }) {
        const lead = await this.prisma.contactLead.create({
            data,
        });

        // Fire & forget email notification
        this.sendEmailNotification(data).catch(err => {
            this.logger.error('Failed to send lead notification email', err);
        });

        return lead;
    }

    private async sendEmailNotification(data: any) {
        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New CRM Inquiry Received</h2>
                
                <h3 style="color: #1f2937;">Lead Details</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; width: 120px;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.name}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Company:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.company || 'N/A'}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.email}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.phone}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Team Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.teamSize || 'N/A'}</td></tr>
                </table>
                
                <h3 style="color: #1f2937;">Message</h3>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; white-space: pre-wrap;">${data.message || 'No additional message provided.'}</div>
                
                <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 30px;">
                    <p style="margin: 0 0 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Source page:</strong> PropertyFlow CRM Landing Page</p>
                    <p style="margin: 15px 0 0 0; text-align: center;">Submitted from PropertyFlow CRM landing page<br/><strong>Powered by WebXAI</strong></p>
                </div>
            </div>
        `;

        if (process.env.SMTP_USER) {
            await this.transporter.sendMail({
                from: '"PropertyFlow CRM" <noreply@propertyflow.com>',
                to: 'webxdev.ai@gmail.com',
                subject: 'New PropertyFlow CRM Inquiry',
                html: emailHtml,
            });
            this.logger.log('Lead notification email sent.');
        } else {
            this.logger.log('Email template generated but not sent because SMTP_USER is not configured in .env');
        }
    }

    async findAll() {
        return this.prisma.contactLead.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
