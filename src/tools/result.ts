export class Result<T, E> {
  #_value: T | undefined;
  #_error: E | undefined;

  constructor(value?: T, error?: E) {
    this.#_value = value;
    this.#_error = error;
  }

  public is_ok(): boolean {
    return this.#_value !== undefined;
  }

  public is_err(): boolean {
    return this.#_error !== undefined;
  }

  public ok(): T | undefined {
    return this.#_value;
  }
}

// 解析URL
export const parseUrl = (url:string, splitSymbol= '&&')=>{
  const qIndex = url.indexOf('?');
  const querystring = url.slice(qIndex+1);
  const queryArr = querystring.split(splitSymbol);
  const queryObj = queryArr.reduce((pre,cur)=>{
    const curQuery = cur.split("=");
    return {
      ...pre,
      [curQuery[0]]:curQuery[1] ||''
    }
  },{})
  return queryObj
}
