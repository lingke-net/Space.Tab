import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
// @ts-expect-error: blueimp-md5 没有类型声明
import md5 from 'blueimp-md5'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据邮箱地址获取 Gravatar 头像 URL
 * @param email 邮箱地址
 * @param size 头像尺寸，默认 200
 * @param defaultImage 默认头像类型，可选 'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank'
 * @returns Gravatar 头像 URL
 */
export function getGravatarURL(email: string, size: number = 200, defaultImage: string = 'identicon'): string {
  if (!email) {
    return `https://gravatar.com/avatar/?d=${defaultImage}&s=${size}`
  }
  
  // 去除首尾空格并转换为小写
  const address = email.trim().toLowerCase()
  
  // 创建 MD5 哈希（Gravatar 使用 MD5）
  const hash = md5(address)
  
  // 返回 Gravatar URL
  return `https://gravatar.com/avatar/${hash}?d=${defaultImage}&s=${size}`
}
