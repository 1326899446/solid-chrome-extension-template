// 解析URL参数
export const parseUrl: (
  url: string,
  splitSymbol?: string
) => Record<string, string> = (url: string, splitSymbol = "&&") => {
  const qIndex = url.indexOf("?");
  const querystring = url.slice(qIndex + 1);
  const queryArr = querystring.split(splitSymbol);
  const queryObj = queryArr.reduce((pre, cur) => {
    const curQuery = cur.split("=");
    return {
      ...pre,
      [curQuery[0]]: curQuery.slice(1).join("=") || "",
    };
  }, {});
  return queryObj;
};
// 得到action
export const getAction = (url: string) => {
  const reg = /action:(\d+)/i;
  return reg.exec(url)?.[1];
};
