import nodemailer from 'nodemailer'
import { prisma } from './prisma'

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  fromName: string
  fromEmail: string
}

const SETTING_KEYS = {
  host: 'smtp_host',
  port: 'smtp_port',
  secure: 'smtp_secure',
  user: 'smtp_user',
  password: 'smtp_app_password',
  fromName: 'smtp_from_name',
  fromEmail: 'smtp_from_email',
} as const

export async function getSmtpConfig(): Promise<SmtpConfig> {
  const rows = await prisma.settings.findMany({
    where: { setting_key: { in: Object.values(SETTING_KEYS) } }
  })
  const map: Record<string, string> = {}
  rows.forEach(r => { map[r.setting_key] = r.setting_value || '' })

  return {
    host: map[SETTING_KEYS.host] || 'smtp.gmail.com',
    port: Number(map[SETTING_KEYS.port]) || 587,
    secure: map[SETTING_KEYS.secure] === 'true',
    user: map[SETTING_KEYS.user] || '',
    password: map[SETTING_KEYS.password] || '',
    fromName: map[SETTING_KEYS.fromName] || 'Cozmic Technology',
    fromEmail: map[SETTING_KEYS.fromEmail] || map[SETTING_KEYS.user] || '',
  }
}

export async function saveSmtpConfig(partial: Partial<SmtpConfig>): Promise<void> {
  const updates: Record<string, string> = {}
  if (partial.host !== undefined) updates[SETTING_KEYS.host] = partial.host
  if (partial.port !== undefined) updates[SETTING_KEYS.port] = String(partial.port)
  if (partial.secure !== undefined) updates[SETTING_KEYS.secure] = partial.secure ? 'true' : 'false'
  if (partial.user !== undefined) updates[SETTING_KEYS.user] = partial.user
  if (partial.password) updates[SETTING_KEYS.password] = partial.password
  if (partial.fromName !== undefined) updates[SETTING_KEYS.fromName] = partial.fromName
  if (partial.fromEmail !== undefined) updates[SETTING_KEYS.fromEmail] = partial.fromEmail

  for (const [key, value] of Object.entries(updates)) {
    await prisma.settings.upsert({
      where: { setting_key: key },
      update: { setting_value: value },
      create: { setting_key: key, setting_value: value, setting_group: 'smtp' }
    })
  }
}

export async function isSmtpConfigured(): Promise<boolean> {
  const config = await getSmtpConfig()
  return Boolean(config.user && config.password)
}

function buildTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  })
}

export async function sendMail(options: { to: string; subject: string; html: string; text?: string }, overrideConfig?: SmtpConfig): Promise<void> {
  const config = overrideConfig || await getSmtpConfig()

  if (!config.user || !config.password) {
    throw new Error('SMTP is not configured. Please set up Google SMTP credentials in Global Settings.')
  }

  const transporter = buildTransporter(config)

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail || config.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
}
