export function hasClass(el, className) {
  try {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
  } catch (e) {
    return false;
  }
}

// 向dom中添加类名
// el 需要添加类名的dom元素
// className 需要判断的类名
export function addClass(el, className) {
  try {
    if (hasClass(el, className)) {
      return false;
    }

    // 通过空格将原有类名字符串组装成数组
    let newClass = el.className.split(' ');
    newClass.push(className);
    // 添加完毕后 通过空格将数组组装为字符串
    el.className = newClass.join(' ');
  } catch (e) {
    return false;
  }
}
//向dom元素中移除class
export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return false;
  }

  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  el.className = el.className.replace(reg, '');
}

export function harClass(el, className) {
  try {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
  } catch (e) {
    return false;
  }
}
// 判断有没有，有就删除
export function hrClass(el, className) {
  if (hasClass(el, className)) {
    removeClass(el, className);
  }
}
export function haClass(el, className) {
  if (hasClass(el, className)) {
    addClass(el, className);
  }
}
