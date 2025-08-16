// 安全的localStorage访问方法
export const safeLocalStorage = {
  getItem(key: string, defaultValue: any = null): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  },
  setItem(key: string, value: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};