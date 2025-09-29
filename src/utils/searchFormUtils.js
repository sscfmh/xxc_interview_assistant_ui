export function buildPageReqVo(formValues, pageReqVo) {
  let newPageReqVo = {
    page: 1,
    pageSize: pageReqVo.pageSize,
  }
  for (let key in formValues) {
    let timeRangeFlag = key.indexOf('TimeRange_')
    if (timeRangeFlag > 0) {
      if (formValues[key]) {
        let realFiledName = key.substring(0, timeRangeFlag)
        newPageReqVo[realFiledName + 'Start'] = formValues[key][0].format('YYYY-MM-DD HH:mm:ss')
        newPageReqVo[realFiledName + 'End'] = formValues[key][1].format('YYYY-MM-DD HH:mm:ss')
      }
    } else if (formValues[key]) {
      newPageReqVo[key] = formValues[key]
    }
  }
  return newPageReqVo
}