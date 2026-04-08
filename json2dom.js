function _render(vnode){
    if (typeof vnode === 'number')
        vnode = String(vnode);
    if (typeof vnode === 'string')
        return document.createTextNode(vnode);
    const dom = document.createElement(vnode.tag);
    if(vnode.attrs) {
        Object.keys(vnode.attrs).forEach((key)=>{
            const value = vnode.attrs[key];
            dom.setAttribute(key,value);
        })
    }
    vnode.children.forEach((child)=>{dom.appendChild(_render(child))});
    return dom;
}

const vdom = {
  tag: 'DIV',
  attrs:{
  id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}

console.log(_render(vdom));