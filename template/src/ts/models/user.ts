export class DefaultUserInfo {
  public authorization = ''
  public headimage = ''
  public cellphone = ''
  public loginName = ''
  public name = ''
  public orgId: number | null = null
  public roleId = 0
  public sex = ''
  public signature = ''
  public studentid = ''
  public token: string | null = null
  public userId = 0
  public institutionName: string | null = null

  constructor(user?: any) {
    this.init(user)
  }

  init(user: any) {
    this.authorization = user?.authorization ?? this.authorization
    this.headimage = user?.headimage ?? this.headimage
    this.cellphone = user?.cellphone ?? this.cellphone
    this.loginName = user?.loginName ?? this.loginName
    this.name = user?.name ?? this.name
    this.orgId = user?.orgId ?? this.orgId
    this.roleId = user?.roleId ?? this.roleId
    this.sex = user?.sex ?? this.sex
    this.signature = user?.signature ?? this.signature
    this.studentid = user?.studentid ?? this.studentid
    this.token = user?.token ?? this.token
    this.userId = user?.userId ?? this.userId
    this.institutionName = user?.institutionName ?? this.institutionName
  }
}