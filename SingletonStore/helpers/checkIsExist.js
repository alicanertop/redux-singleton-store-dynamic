const checkIsExist = ({ data, message, isWarn, printError }) => {
  const isExist = Boolean(data) && data !== undefined && data !== null

  if (isWarn) console.warn(message)
  if (!isExist || printError) console.error(message)

  return isExist
}

exports.checkIsExist = checkIsExist
module.exports = { checkIsExist }
