import { http } from '@/utils/http.js'

/**
 * 获取老人用药记录
 * @param {Object} data - 请求参数
 * @param {number} data.oldId - 老人ID
 */
export const getMedicationRecord = (data) => {
  return http({
    url: '/old/medicationRecord',
    method: 'GET',
    data
  })
}

/**
 * 改变老人用药提醒状态
 * @param {Object} data - 请求参数
 * @param {number} data.medicationId - 药物ID
 * @param {number} data.medicationStatus - 吃药状态（0已吃，1未吃）
 */
export const finishMedication = (data) => {
  return http({
    url: '/old/finish',
    method: 'POST',
    data
  })
}

/**
 * 获取我的亲友
 * @param {Object} data - 请求参数
 * @param {number} data.oldId - 老人ID
 */
export const getMyRelative = (data) => {
  return http({
    url: '/old/myRelative',
    method: 'GET',
    data
  })
}
