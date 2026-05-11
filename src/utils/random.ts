export const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)] as T;

export const maybe = (probability = 0.5): boolean => Math.random() < probability;

export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const requestId = (): string => `REQ-${randomInt(100000, 999999)}`;

export const protocol = (prefix = 'PRT'): string => `${prefix}-${new Date().getFullYear()}-${randomInt(100000, 999999)}`;

export const futureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

export const dateTime = (daysFromNow: number, hour = 9): string => `${futureDate(daysFromNow)}T${String(hour).padStart(2, '0')}:00:00Z`;
