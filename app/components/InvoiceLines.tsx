import React from 'react'
import { Invoice } from '@/type'
import { Plus, Trash } from 'lucide-react'
import { InvoiceLine } from '@prisma/client'

interface Props {
  invoice: Invoice
  setInvoice: (invoice: Invoice) => void
}


const InvoiceLines: React.FC<Props> = ({ invoice, setInvoice }) => {

  const handleAddLines = () => {
    const newLine: InvoiceLine = {
      id: `${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      invoiceId: invoice.id
    }
    setInvoice({
      ...invoice,
      lines: [...invoice.lines, newLine],
    });

  }


  const handleQuantityChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].quantity = value === '' ? 0 : parseInt(value);
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].description = value;
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].unitPrice = value === '' ? 0 : parseFloat(value);
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleRemoveLine = (index: number) => {
    const updatedLines = invoice.lines.filter((_, i) => i !== index);
    setInvoice({ ...invoice, lines: updatedLines });
  };



  return (
    <div className='h-fit bg-base-200 p-5 rounded-xl w-full'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="badge badge-accent">Produits / Services</h2>
        <button className='btn btn-sm btn-accent'
          onClick={handleAddLines}
        >
          <Plus className='w-4' />
        </button>
      </div>

      <div className='scrollable'>
        <table className='table w-full'>
          <thead className='uppercase '>
            <tr>
              <th>Désignations</th>
              <th>Quantité</th>
              <th>Prix unitaire (HT)</th>
              <th>Montant (HT)</th>
              <th></th>
            </tr>


          </thead>

          <tbody className="">

            {invoice?.lines?.map((line, index) => (
              <tr key={line.id} className=''>




                <td>
                  <input type="text" value={line.description}
                    className='input input-sm input-bordered w-full'
                    onChange={(e) => {
                      handleDescriptionChange(index, e.target.value);
                    }}
                  />
                </td>

                <td>
                  <input type="number" value={line.quantity}
                    className='input input-sm input-bordered w-full'
                    min={0}
                    onChange={(e) => {
                      handleQuantityChange(index, e.target.value);
                    }}
                  />
                </td>







                <td>
                  <input type="number" value={line.unitPrice}
                    className='input input-sm input-bordered w-full'
                    min={0}
                    step={25}
                    onChange={(e) => {
                      handleUnitPriceChange(index, e.target.value);
                    }}
                  />
                </td>
                

                <td className='font-bold'>
                  {line.quantity * line.unitPrice} FCFA
                </td>


                <td>
                  <button className='btn btn-sm btn-accent btn-circle'
                    onClick={() => handleRemoveLine(index)}
                  >
                    <Trash className='w-4' />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>


        </table>
      </div>

    </div>
  )
}

export default InvoiceLines
