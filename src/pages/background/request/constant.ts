export function MapActionToServer(action : string|number){
    const actionNumber= parseInt(`${action}`,10)
    if(actionNumber >=27700 && actionNumber<=27799){
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