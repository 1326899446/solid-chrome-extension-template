export const whitePages = ["localhost","221.6.6.237"];

export const judgeAuthority = (url) => {
  for (let i = 0; i < whitePages.length; i++) {
    if (url.includes(whitePages[i])) {
      return true;
    }
  }
  return false;
};
