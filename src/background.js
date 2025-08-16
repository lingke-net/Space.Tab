// 浏览器扩展的后台脚本
console.log('Space.Tab 扩展已加载');

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Space.Tab 扩展已安装');
});