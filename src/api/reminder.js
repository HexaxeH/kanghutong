// 获取所有的用药提醒 
export function fetchMedicationReminders(oldId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/medicationReminder',
      method: 'GET',
      data: { oldId: Number(oldId) },
      success: (res) => {
        console.log('获取所有用药提醒成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('获取所有用药提醒失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 用药提醒设置
export function medicationReminderSettings(relativeId, id, medicationTitle, medicationName, remindTime, medicationFrequency, dose) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/medicationReminder',
      method: 'POST',
      data: {
        relativeId: Number(relativeId),
        oldId: Number(id),
        medicationTitle: String(medicationTitle),
        medicationName: String(medicationName),
        remindTime: String(remindTime),
        medicationFrequency: String(medicationFrequency),
        dose: String(dose),
      },
      success: (res) => {
        console.log('设置用药提醒成功:', res.data);
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时，将有效数据 resolve 出去
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('设置用药提醒失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 删除用药提醒
export function deleteMedicationReminder(medicationId) {
  return new Promise((resolve, reject) => {
    return uni.request({
      url: '/relative/medicationReminder',
      method: 'DELETE',
      data: {
        medicationId: Number(medicationId)
      },
      success: (res) => {
        console.log('设置用药提醒成功:', res.data);
        if (res.statusCode === 200) { // 成功时，将有效数据 resolve 出去
          resolve(res.data);
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('设置用药提醒失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 结束该用药提醒
export function endMedicationReminder(medicationId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/relative/endReminder',
      method: 'PUT',
      data: {
        medicationId: Number(medicationId)
      },
      success: (res) => {
        console.log('结束用药提醒成功:', res.data);
        if (res.statusCode === 200) { // 成功时，将有效数据 resolve 出去
          resolve(res.data);
        } else {
          reject(new Error('接口返回状态异常'));
        }
      },
      fail: (err) => {
        console.error('结束用药提醒失败:', err);
        reject(err); // 失败时，将错误 reject 出去
      }
    });
  });
}

// 获取老人用药记录（当前接口无法使用）
// export function fetchMedicationReminders(oldId) {
//   return uni.request({
//     url: '/old/medicationRecord',
//     method: 'GET',
//     data: { oldId: Number(oldId) },
//     success: (res) => {
//       console.log('获取老人用药提醒成功:', res.data);
//       return res.data;
//     },
//     fail: (err) => {
//       console.error('获取老人用药提醒失败:', err);
//       return err;
//     }
//   });
// }
