import { inject, PLATFORM_ID, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class BrowserStorage {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly prefix = 'shopora.';

  read<T>(key: string, fallback: T, isValid: (value: unknown) => value is T, session = false): T {
    if (!this.isBrowser) return fallback;
    try {
      const raw = this.store(session).getItem(this.prefix + key);
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : fallback;
    } catch {
      return fallback;   // private mode, corrupted JSON, storage disabled
    }
  }

  write(key: string, value: unknown, session = false): void {
    if (!this.isBrowser) return;
    try {
      this.store(session).setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      // QuotaExceededError, or Safari private mode. Storage is a convenience, never fatal.
    }
  }

  remove(key: string, session = false): void {
    if (!this.isBrowser) return;
    this.store(session).removeItem(this.prefix + key);
  }

  private store(session: boolean): Storage {
    return session ? sessionStorage : localStorage;
  }
}