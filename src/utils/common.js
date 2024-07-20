function removeSubstring(str, substr) {
  const regex = new RegExp(substr, 'gi');
  return str.replace(regex, '');
}

function openNewPageBlank(e, fullPath) {
  if (!e) return;
  let currentUrl = window.location.href;
  window.open(removeSubstring(currentUrl, fullPath) + e, '_blank');
}
function Parseurls(a) {
  let res = [];
  a.forEach((item) => {
    if (item.children.length > 0) {
      item.children = Parseurls(item.children);
    } else {
      item.children = [];
    }
    res.push({
      value: item.id,
      label: item.meta.title,
      children: item.children,
    });
  });
  return res;
}
// 提取所有的id
function ParseUrlsIds(a) {
  let res = [];
  a.forEach((item) => {
    if (item.children.length === 0) {
      res.push(item.id);
    }
    if (item.children.length > 0) {
      res = res.concat(ParseUrlsIds(item.children));
    }
  });
  return res;
}
export { Parseurls, ParseUrlsIds, openNewPageBlank };
