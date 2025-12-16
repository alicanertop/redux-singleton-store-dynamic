interface CheckIsExistParams {
  message: string
  isWarn?: boolean
  printError?: boolean
}

export const checkIsExist = <T>(data: T, params: CheckIsExistParams): data is T => {
  const { message, isWarn, printError } = params
  const isExist = Boolean(data) && data !== undefined && data !== null

  if (isWarn) console.warn(message)
  if (!isExist || printError) console.error(message)

  return isExist
}
