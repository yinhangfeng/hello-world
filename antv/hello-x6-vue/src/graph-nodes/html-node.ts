const htmlNode = {
  html(cell: any) {
    const { label } = cell.getData();
    const div = document.createElement('div');
    div.className = 'custom-html';
    div.innerText = 'custom-html ' + label;
    div.style.color = '#333';
    return div;
  },
};

export default htmlNode;
