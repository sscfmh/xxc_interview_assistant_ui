/**
 * 检查字符串是否为空白（类似Java的isBlank）
 * @param {any} value - 要检查的值
 * @returns {boolean} 如果是空白字符串则返回true，否则返回false
 */
export function isBlank(value) {
  // 只有字符串类型才可能是blank，其他类型直接返回false
  if (typeof value !== "string") {
    return false;
  }
  // 空字符串或仅包含空白字符的字符串都视为blank
  return value.trim().length === 0;
}

/**
 * 检查字符串是否为整数字符串
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 如果是整数字符串则返回true，否则返回false
 */
export function isIntStr(str) {
  // 检查是否为字符串类型
  if (!str || isBlank(str) || typeof str !== "string") {
    return false;
  }

  // 正则匹配：可选的正负号开头，后跟一个或多个数字
  const integerRegex = /^\d+$/;
  return integerRegex.test(str);
}

/**
 * 将数字转换为字符串
 * @param {number} num - 要转换的数字
 * @returns {string} 转换后的字符串
 */
export function intToStr(num) {
  if (num === null || num === undefined) {
    return "";
  }
  return num + "";
}

/**
 * 递归处理对象，将所有空白字符串转换为null
 * @param {any} value - 要处理的值，可以是任意类型
 * @returns {any} 处理后的值
 */
export function convertBlankToNull(value) {
  // 处理null和undefined
  if (value === null || value === undefined) {
    return value;
  }

  // 处理字符串：如果是空白则转为null
  if (typeof value === "string") {
    return isBlank(value) ? null : value;
  }

  // 处理数组：递归处理每个元素
  if (Array.isArray(value)) {
    return value.map((item) => convertBlankToNull(item)).filter((item) => item);
  }

  // 处理对象：递归处理每个属性
  if (typeof value === "object" && !Array.isArray(value)) {
    const result = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = convertBlankToNull(value[key]);
      }
    }
    return result;
  }

  // 其他类型（数字、布尔值等）保持不变
  return value;
}

export default {
  isBlank,
  isIntStr,
  convertBlankToNull,
  intToStr,
};
