export class ServiceError extends Error{ // 逻辑错误
  private errCode: string

  constructor(msg, errCode){
    super(msg)
    this.errCode = errCode
  }

}