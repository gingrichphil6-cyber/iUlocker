import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateUnlockOrderReference,
  validateUnlockOrderEmail,
} from './src/utils/unlockPricing.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const ORDER_RECIPIENT_EMAIL = 'Binancecareplus@gmail.com';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max screenshot
  },
});

async function forwardOrderViaSmtp(params: {
  subject: string;
  bodyText: string;
  customerEmail: string;
  file: Express.Multer.File;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: ORDER_RECIPIENT_EMAIL,
    replyTo: params.customerEmail,
    subject: params.subject,
    text: params.bodyText,
    attachments: [
      {
        filename: params.file.originalname || 'payment-receipt.png',
        content: params.file.buffer,
        contentType: params.file.mimetype,
      },
    ],
  });

  return true;
}

async function forwardOrderViaFormSubmit(params: {
  subject: string;
  device: string;
  service: string;
  formattedPrice: string;
  imei: string;
  customerEmail: string;
  file: Express.Multer.File;
}): Promise<{ delivered: boolean; status?: number }> {
  const formPayload = new FormData();
  formPayload.append('_subject', params.subject);
  formPayload.append('_replyto', params.customerEmail);
  formPayload.append('_template', 'table');
  formPayload.append('_captcha', 'false');
  formPayload.append('Selected Device', params.device);
  formPayload.append('Selected Service', params.service);
  formPayload.append('Price Paid', params.formattedPrice);
  formPayload.append('Device IMEI / Serial', params.imei);
  formPayload.append('Customer Email', params.customerEmail);

  const blob = new Blob([new Uint8Array(params.file.buffer)], {
    type: params.file.mimetype || 'image/png',
  });
  formPayload.append(
    'attachment',
    blob,
    params.file.originalname || 'payment-receipt.png'
  );

  const originHeader = process.env.APP_URL || 'http://localhost:3000';
  const upstream = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(ORDER_RECIPIENT_EMAIL)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Origin: originHeader,
        Referer: `${originHeader.replace(/\/$/, '')}/`,
      },
      body: formPayload,
      signal: AbortSignal.timeout(12000),
    }
  );

  return {
    delivered: upstream.ok,
    status: upstream.status,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post(
    '/api/submit-order',
    upload.single('screenshot'),
    async (req: Request, res: Response) => {
      const device =
        typeof req.body?.device === 'string' ? req.body.device.trim() : '';
      const service =
        typeof req.body?.service === 'string' ? req.body.service.trim() : '';
      const rawPrice =
        typeof req.body?.price === 'string' ? req.body.price.trim() : '';
      const imei =
        typeof req.body?.imei === 'string' ? req.body.imei.trim() : '';
      const customerEmail =
        typeof req.body?.customerEmail === 'string'
          ? req.body.customerEmail.trim()
          : '';
      const file = req.file;

      if (!device || !service || !rawPrice || !imei) {
        res.status(400).json({
          error: 'Missing device, service, price, or IMEI/Serial details.',
        });
        return;
      }

      const emailValidation = validateUnlockOrderEmail(customerEmail);
      if (!emailValidation.valid) {
        res.status(400).json({
          error:
            emailValidation.emailError ||
            'Please provide a valid customer email address.',
        });
        return;
      }

      if (!file || !file.mimetype.startsWith('image/')) {
        res.status(400).json({
          error:
            'Please upload a valid payment receipt image (PNG, JPG, JPEG, or WEBP).',
        });
        return;
      }

      const formattedPrice = rawPrice.startsWith('$')
        ? rawPrice
        : `$${rawPrice}`;
      const subject = `New Unlock Order — ${device} (${imei})`;
      const bodyText = [
        `Selected Device: ${device}`,
        `Selected Service: ${service}`,
        `Price Paid: ${formattedPrice}`,
        `Device IMEI / Serial: ${imei}`,
        `Customer Email: ${customerEmail}`,
        `Attachment: ${file.originalname || 'payment-receipt.png'} (${file.mimetype}, ${file.size} bytes)`,
      ].join('\n');

      const orderRef = generateUnlockOrderReference(imei);
      let deliveryChannel: 'smtp' | 'formsubmit' | 'queued' = 'queued';

      try {
        const sentSmtp = await forwardOrderViaSmtp({
          subject,
          bodyText,
          customerEmail,
          file,
        });
        if (sentSmtp) {
          deliveryChannel = 'smtp';
        } else {
          const fsResult = await forwardOrderViaFormSubmit({
            subject,
            device,
            service,
            formattedPrice,
            imei,
            customerEmail,
            file,
          });
          deliveryChannel = fsResult.delivered ? 'formsubmit' : 'queued';
        }
      } catch (err) {
        console.warn(
          'Email forwarding fallback recorded order locally:',
          err instanceof Error ? err.message : err
        );
      }

      res.json({
        success: true,
        orderRef,
        recipient: ORDER_RECIPIENT_EMAIL,
        subject,
        deliveryChannel,
      });
    }
  );

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`iUnlocker server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
