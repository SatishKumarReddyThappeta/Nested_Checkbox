import { useState } from 'react';
import { nestedCheckBoxData } from './Data/data';

const App = () => {
  const [data, setData]= useState(nestedCheckBoxData);

  function updateChildren(data, flag){
    let newData = data.map((node)=>{
      node.isChecked= flag;
      let updatedData = updateChildren(node.children, flag);
      return {...node, children : updatedData};
    })
    return newData;
  }

  function updateNode(data, id, flag){
    let newData = data.map((node)=>{
      if(node.id == id){
        node.isChecked= flag;
        let updatedData = updateChildren(node.children, flag);
        return {...node, children: updatedData};
      }else if(node.children){
        let updatedData = updateNode(node.children, id, flag)
        return {...node, children: updatedData};
      }
      return node;
    })
    return newData;
  }

  function updateParent(data){
    let newData = data.map((node)=>{
      if(node.children.length>0){
        let updatedData = updateParent(node.children);
        let flag = updatedData.every((node)=> node.isChecked)
        return {...node, isChecked: flag, children: updatedData};
      }
      return node;
    })
    return newData;
  }

  function handleChange(id, flag){
      let updatedData = updateNode(data, id, flag);
      let result = updateParent(updatedData);
      setData(result);
  }

  return (
    <div>
      <div>Nested check Boxes</div>
      <div>
        {
          data.map((node)=>{
            return <NestedCheckBox key={node.id} data={node} handleChange={handleChange}/>
          })
        }
      </div>
    </div>
  )
}


function NestedCheckBox({data, handleChange}){
  return(
    <div className='pl-6'>
      <div className='flex gap-2'>
        <input type='checkbox' checked={data.isChecked} onChange={(e)=> handleChange(data.id, e.target.checked)}/>
        <div>{data.id}</div>
      </div>
      <div>
        {
          data.children.map((node)=>{
            return <NestedCheckBox key={node.id} data={node} handleChange={handleChange}/>
          })
        }
      </div>
    </div>
  )
}

export default App