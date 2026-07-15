import * as dotenv from 'dotenv';
import path from 'path';

const envName = process.env.ENV || '';
const envFile = envName ? `.env.${envName}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseStringUnion = <T extends string>(
  value: string | undefined,
  fallback: T,
  validValues: readonly T[],
): T => {
  if (!value) return fallback;
  return (validValues.includes(value as T) ? (value as T) : fallback) as T;
};

export type ScreenshotMode = 'off' | 'on' | 'only-on-failure';
export type VideoMode = 'off' | 'on' | 'retain-on-failure';
export type TraceMode = 'off' | 'on' | 'retain-on-failure';

export interface EnvConfig {
  BASE_URL: string;
  HEADLESS: boolean;
  DEFAULT_TIMEOUT: number;
  EXPECT_TIMEOUT: number;
  SCREENSHOT: ScreenshotMode;
  VIDEO: VideoMode;
  TRACE: TraceMode;
  CI: boolean;
  LOGIN_EMAIL: string;
  LOGIN_PASSWORD: string;
}

export const env: EnvConfig = {
  BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000',
  HEADLESS: parseBoolean(process.env.HEADLESS, true),
  DEFAULT_TIMEOUT: parseNumber(process.env.DEFAULT_TIMEOUT, 30000),
  EXPECT_TIMEOUT: parseNumber(process.env.EXPECT_TIMEOUT, 5000),
  SCREENSHOT: parseStringUnion(process.env.SCREENSHOT, 'only-on-failure', [
    'off',
    'on',
    'only-on-failure',
  ]),
  VIDEO: parseStringUnion(process.env.VIDEO, 'retain-on-failure', [
    'off',
    'on',
    'retain-on-failure',
  ]),
  TRACE: parseStringUnion(process.env.TRACE, 'retain-on-failure', [
    'off',
    'on',
    'retain-on-failure',
  ]),
  CI: parseBoolean(process.env.CI, false),
  LOGIN_EMAIL: process.env.LOGIN_EMAIL ?? '',
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD ?? '',
};
