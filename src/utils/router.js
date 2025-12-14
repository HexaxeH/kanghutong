/**
 * 路由配置和导航方法
 */

// 页面路径常量
export const PAGE_PATH = {
  LOGIN: '/pages/login/Login',
  GUARD: '/pages/guard/Guard',
  REMINDER: '/pages/reminder/Reminder',
  MINE: '/pages/mine/Mine',
  FAMILY_DETAIL: '/pages/guard/FamilyDetail'
};

/**
 * 导航到指定页面
 * @param {string} url - 页面路径
 * @param {Object} params - 页面参数
 * @param {boolean} isReplace - 是否替换当前页面
 */
export function navigateTo(url, params = {}, isReplace = false) {
  // 构建带参数的URL
  let fullUrl = url;
  if (Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }
  
  // 执行导航
  if (isReplace) {
    uni.redirectTo({
      url: fullUrl,
      fail: (err) => {
        console.error('导航失败:', err);
      }
    });
  } else {
    uni.navigateTo({
      url: fullUrl,
      fail: (err) => {
        console.error('导航失败:', err);
      }
    });
  }
}

/**
 * 返回上一页
 * @param {number} delta - 返回的页面数
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({
    delta: delta,
    fail: (err) => {
      console.error('返回失败:', err);
    }
  });
}

/**
 * 跳转到底部TabBar页面
 * @param {string} url - TabBar页面路径
 */
export function switchTab(url) {
  uni.switchTab({
    url: url,
    fail: (err) => {
      console.error('切换TabBar失败:', err);
    }
  });
}