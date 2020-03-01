function wxRequst(url, data, type) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: type,
            success: function (res) {
                if (res.statusCode) {
                    resolve(res) //成功调用resolve
                } else {
                    reject(res) //失败调用reject
                }
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}

export default wxRequst