class AMapLite {
  constructor(opts) {
    this.key = opts && opts.key ? opts.key : ''
  }
  getRegeo(a) {
    const run = (loc) => {
      uni.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        method: 'GET',
        data: { key: this.key, location: loc, extensions: 'all' },
        success: (res) => {
          if (res.data && res.data.status === '1') {
            const d = res.data.regeocode
            a.success([{ regeocodeData: d }])
          } else {
            a.fail({ errCode: res.data && res.data.infocode, errMsg: res.data && res.data.info })
          }
        },
        fail: (err) => {
          a.fail({ errCode: '0', errMsg: err.errMsg || '' })
        }
      })
    }
    if (a.location) {
      run(a.location)
    } else {
      uni.getLocation({
        type: 'gcj02',
        success: (pos) => run(`${pos.longitude},${pos.latitude}`),
        fail: (err) => a.fail({ errCode: '0', errMsg: err.errMsg || '' })
      })
    }
  }
  getPoiAround(a) {
    const run = (loc) => {
      uni.request({
        url: 'https://restapi.amap.com/v3/place/around',
        method: 'GET',
        data: {
          key: this.key,
          location: loc,
          keywords: a.query_keywords || '',
          radius: 3000,
          offset: 20,
          page: 1,
          extensions: 'base'
        },
        success: (res) => {
          if (res.data && res.data.status === '1') {
            const pois = res.data.pois || []
            const data = pois.map((p, idx) => ({
              id: p.id || idx,
              name: p.name,
              address: p.address || p.type,
              location: p.location,
              distance: p.distance ? Number(p.distance) : 0,
              type: p.type,
              tel: p.tel
            }))
            a.success(data)
          } else {
            a.fail({ errCode: res.data && res.data.infocode, errMsg: res.data && res.data.info })
          }
        },
        fail: (err) => {
          a.fail({ errCode: '0', errMsg: err.errMsg || '' })
        }
      })
    }
    if (a.location) {
      run(a.location)
    } else {
      uni.getLocation({
        type: 'gcj02',
        success: (pos) => run(`${pos.longitude},${pos.latitude}`),
        fail: (err) => a.fail({ errCode: '0', errMsg: err.errMsg || '' })
      })
    }
  }
}

export { AMapLite }
