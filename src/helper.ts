/**
 * 将对象扁平化
 * @param {Object} obj 需要扁平化的对象
 * @param {String|null} parentKey 父级key
 * @returns {Object} 返回扁平化后的对象
 */
export function flattenObject(
  obj: { [key: string]: any },
  parentKey?: string
): { [key: string]: any } {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;
    return {
      ...acc,
      ...(typeof value === "object" && value !== null
        ? flattenObject(value, currentKey)
        : { [currentKey]: value }),
    };
  }, {});
}
