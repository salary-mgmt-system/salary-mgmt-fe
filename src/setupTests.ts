import '@testing-library/jest-dom';

// Force a consistent locale for testing to avoid system/locale-dependent number formatting issues
const OriginalNumberFormat = Intl.NumberFormat;
class SafeNumberFormat extends OriginalNumberFormat {
  constructor(locales?: string | string[], options?: Intl.NumberFormatOptions) {
    super(locales || 'en-US', options);
  }
}
globalThis.Intl.NumberFormat = SafeNumberFormat as unknown as typeof Intl.NumberFormat;
