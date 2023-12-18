const pageElements = [
  'select_language',
  'select_dialect',
  'info',
  'input1',
  'input2',
].reduce((map, html_id) => {
  map[html_id] = document.getElementById(html_id);
  return map;
}, []);

const showInfo = infoId => {
  if (infoId) {
    for (let child = pageElements['info'].firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id === infoId ? 'inline' : 'none';
      }
    }
    pageElements['info'].style.visibility = 'visible';
  } else {
    pageElements['info'].style.visibility = 'hidden';
  }
};

export { pageElements, showInfo }
