// 录入老人基本信息
export function relativeBasicMessage(oldId, oldName, gender, oldTelephone, relation) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/basicMessage',
      method: 'GET',
      data: {
        oldId: Number(oldId),
        oldName: String(oldName),
        gender: Number(gender),
        oldTelephone: String(oldTelephone),
        relation: String(relation)
      },
      success: (res) => {
        console.log('录入老人基本信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('录入老人基本信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 录入老人健康信息
export function relativeHealthMessage(oldId, birthDay, height, weight, allergies) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/healthMessage',
      method: 'GET',
      data: {
        oldId: Number(oldId),
        birthDay: String(birthDay),
        height: String(height),
        weight: String(weight),
        allergies: String(allergies)
      },
      success: (res) => {
        console.log('录入老人健康信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('录入老人健康信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 修改老人基本信息
export function updateBasicMessage(oldId, oldName, gender, oldTelephone) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/updateBasicMessage',
      method: 'PUT',
      data: {
        oldId: Number(oldId),
        oldName: String(oldName),
        gender: Number(gender),
        oldTelephone: String(oldTelephone)
      },
      success: (res) => {
        console.log('修改老人基本信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('修改老人基本信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 修改老人健康信息
export function updateHealthMessage(oldId, birthDay, height, weight, allergies) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/updateHealthMessage',
      method: 'PUT',
      data: {
        oldId: Number(oldId),
        birthDay: String(birthDay),
        height: String(height),
        weight: String(weight),
        allergies: String(allergies)
      },
      success: (res) => {
        console.log('修改老人健康信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('修改老人健康信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 获取老人基本信息
export function oldBasicMessage(oldId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/old/basicMessage',
      method: 'GET',
      data: { oldId: Number(oldId) },
      success: (res) => {
        console.log('获取老人基本信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('获取老人基本信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 获取老人健康信息
export function oldHealthMessage(oldId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/old/healthMessage',
      method: 'GET',
      data: { oldId: Number(oldId) },
      success: (res) => {
        console.log('获取老人健康信息成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('获取老人健康信息失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}