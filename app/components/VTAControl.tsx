import React from 'react'
import { Invoice } from '@/type'

interface Props {
    invoice: Invoice 
    setInvoice: (invoice: Invoice) => void
}



const VTAControl : React.FC<Props> = ({ invoice, setInvoice }) => {



  const handleVTAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice(
      { ...invoice,
       vatActive: e.target.checked,
       vatRate: e.target.checked ? invoice?.vatRate : 0 
      });
  };

  const handleVTARateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice(
      { ...invoice,
       vatRate: parseFloat(e.target.value),
     });
  };



  return (
    <div className='flex items-center mt-2 '>
      <label className='block text-sm font-bold'>TVA(%) </label>
      <input type="checkbox"
      className="toggle toggle-sm 2 ml-2" 
      checked={invoice?.vatActive}
      onChange={handleVTAChange}
      />
    {
      invoice?.vatActive && (
        <input
        type="number"
        value={invoice?.vatRate}
        className='input input-sm input-bordered w-16 ml-2'
        onChange={handleVTARateChange}
        min={0}
        />
      )
    }
      
    </div>
  )
}

export default VTAControl
