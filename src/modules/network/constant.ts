// 暂时写死的
export function MapActionToServer(action : string|number){
    const actionNumber= parseInt(`${action}`,10)
    if(actionNumber >=27000 && actionNumber<=27799){
        return ZXAddress;
    }else if(actionNumber>=35100 && actionNumber<= 35199){
        return JYAddress;
    }else {
        return HQAddress;
    }
}
export const JYAddress = "http://221.6.6.237:18200/";
export const HQAddress = "http://221.6.6.237:18100/";
export const ZXAddress = "http://221.6.6.237:18300/";


export const NATIVE_PARAMS_LIST = {
  Token: 'token',
  MobileCode: 'mobilecode',
  '27CheckFlag': '1',
  protocol: '2013',
  LocalIP: 'fddc:f6a9:ebd9:0:91be:d839:ff06:4f6',
  IMSI: '[EMPTY]',
  OSVersion: 'Android10',
  CFrom: 'cfrom',
  vversion: 'upversion',
  uniqueid: 'uniqueid',
  UseMobileCode: 'NA',
  TFrom: 'tfrom',
  ICCID: '[EMPTY]',
  htreqfrom: 'web',
  ANDROIDID: '327bf10765e09b3b',
  IMEI: '[EMPTY]',
  ReqNo: 'reqno',
  version: 'upversion',
  MAC: '42:89:AE:43:EB:BE',
  isOpenRecommend: 'recommend_stat',
  serverIp: '221.6.6.132:6200',
  linkType: 'zx',
  MobileType: '3',
  tokenType: '0',
  PID: '23811',
};