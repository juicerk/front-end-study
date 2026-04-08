const  data = [
  {
    id: '1',
    name: '父节点1',
    children: [
      {
        id: '1-1',
        name: '子节点1-1',
        children: [
          {
            id: '1-1-1',
            name: '子节点1-1-1'
          },
          {
            id: '1-1-2',
            name: '子节点1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '父节点2',
    children: [
      {
        id: '2-1',
        name: '子节点2-1'
      }
    ]
  }
]

function treeToList(data) {
    const res = []
    const dfs = (tree) => {
        tree.forEach(node => {
            if(node.children) {
                dfs(node.children);
                delete node.children;
            }
            res.push(node)
        });
    }
    dfs(data);
    return res;
}
console.log(treeToList(data));