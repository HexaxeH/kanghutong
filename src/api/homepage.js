// 获取所有亲属关系
export function relativeMyRelative(relativeId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/myRelative',
      method: 'GET',
      data: { relativeId: Number(relativeId) },
      success: (res) => {
        console.log('获取所有亲属关系成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('获取所有亲属关系失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 获取老人的亲友
export function oldMyRelative(oldId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/old/myRelative',
      method: 'GET',
      data: { oldId: Number(oldId) },
      success: (res) => {
        console.log('获取老人的亲友成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('获取老人的亲友失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 录入个人基本信息
export function relativeSelfMessage(relativeId, relativeName, relativeTelephone) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/selfMessage',
      method: 'GET',
      data: {
        relativeId: Number(relativeId),
        relativeName: String(relativeName),
        relativeTelephone: String(relativeTelephone)
      },
      success: (res) => {
        console.log('录入个人基本信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('录入个人基本信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 解除绑定
export function relativeRemove(relativeId, oldId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/remove',
      method: 'GET',
      data: {
        relativeId: Number(relativeId),
        oldId: Number(oldId)
      },
      success: (res) => {
        console.log('解除绑定成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('解除绑定失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}