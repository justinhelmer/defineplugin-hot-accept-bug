module.exports = {
  render: () => {
    const content = '<h1>Hello World</h1>';
    document.getElementsByTagName('body')[0].innerHTML = content;
    console.log('rendered', content);
  },
};
