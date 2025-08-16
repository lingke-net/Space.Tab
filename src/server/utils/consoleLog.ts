type LogType = 'info' | 'warn' | 'error';

// ANSI 颜色转义序列（终端专用）
const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',    // 时间颜色
  green: '\x1b[32m',   // info/成功颜色
  yellow: '\x1b[33m',  // warn 颜色
  red: '\x1b[31m',     // error 颜色
  blue: '\x1b[34m',    // URL 颜色
  cyan: '\x1b[36m',    // 其他信息颜色
  magenta: '\x1b[35m'  // 错误详情颜色
};

const getTimeNow = () => {
  const now = new Date();
  
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const period = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
};

export default class ConsoleLog {
  // 生成带颜色的文本
  private static colorize(text: string, colorCode: string): string {
    return `${colorCode}${text}${colors.reset}`;
  }

  // 通用日志方法
  static log(message: string, type: LogType = 'info') {
    const time = this.colorize(getTimeNow(), colors.gray);
    let contentColor = colors.green; // 默认info用绿色
    
    if (type === 'warn') contentColor = colors.yellow;
    if (type === 'error') contentColor = colors.red;
    
    const content = this.colorize(message, contentColor);
    console.log(`${time} ${content}`);
  }
  
  // 警告日志
  static warn(message: string) {
    this.log(message, 'warn');
  }
  
  // 错误日志（支持同时输出消息和错误对象）
  static error(message: string, error?: Error | unknown) {
    const time = this.colorize(getTimeNow(), colors.gray);
    const content = this.colorize(message, colors.red);
    
    // 如果提供了错误对象，单独输出错误详情
    if (error) {
      console.log(`${time} ${content}`);
      console.log(`${time} ${this.colorize('详情:', colors.magenta)}`, error);
    } else {
      console.log(`${time} ${content}`);
    }
  }
  
  // URL信息日志（蓝色+下划线）
  static url(message: string, url: string) {
    const time = this.colorize(getTimeNow(), colors.gray);
    const label = this.colorize(message, colors.cyan);
    const link = this.colorize(url, '\x1b[34;4m'); // 蓝色+下划线
    console.log(`${time} ${label} ${link}`);
  }
}
