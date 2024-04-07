// 格式化时间显示
export const formatDate = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return dateString.toLocaleDateString(undefined, options);
};

// 截断长文本
export const truncate = (str: string, length = 100, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};