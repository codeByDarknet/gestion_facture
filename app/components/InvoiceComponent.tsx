import React from 'react'
import { Invoice } from '@/type'
import { CheckCircle, Clock, FileText, Plus, SquareArrowUpRight, XCircle } from 'lucide-react';
import Link from 'next/link';

type InvoiceComponentProps = {
    invoice: Invoice;
    index: number;
}

const getStautBadge = (code : number) => {
    switch(code){
        case 1:
            return (
                <div className=" badge badge-lg flex items-center  gap-2">
                    <FileText className="w-4"/>
                    Brouillon
                </div>
            )
        case 2:
            return (
                <div className=" badge badge-lg badge-warning flex items-center  gap-2">
                    <Clock className="w-4"/>
                    En attente
                </div>
            )
        case 3:
            return (
                <div className=" badge badge-lg badge-success  flex items-center  gap-2">
                    <CheckCircle className="w-4"/>
                    Payée
                </div>
            )
        case 4:
            return (
                <div className=" badge badge-info badge-lg flex items-center  gap-2">
                    <XCircle className="w-4"/>
                    Annulée
                </div>
            )
        case 5:
            return (
                <div className=" badge badge-lg badge-error flex items-center  gap-2">
                    <XCircle className="w-4"/>
                    Impayée
                </div>
            )
        default:
            return (
                <div className=" badge badge-lg flex items-center  gap-2">
                    <FileText className="w-4"/>
                    Indefini
                </div>
            )
    }
}


const InvoiceComponent : React.FC<InvoiceComponentProps> = ({invoice, index}) => {

const calculTotal = () => {
    const totalHT = invoice?.lines?.reduce((acc, line) => {    
        const quantity = line.quantity ?? 0
        const unitPrice = line.unitPrice ?? 0
        return acc + (quantity * unitPrice)
    }, 0)
    
    const totalVAT = totalHT * ((invoice?.vatRate ?? 0) / 100)
    return totalHT + totalVAT
}

  return (
    <div className='bg-base-200/90 p-5 rounded-xl space-y-2 shadow'>
      
        <div className="flex justify-between items-center w-full">
            <div className="">{
                getStautBadge(invoice.status)
            }</div>
            <Link 
            href={`/invoice/${invoice.id}`
            } className="btn btn-accent bnt-sm">
            Plus
            <SquareArrowUpRight className="w-6 h-6" />
            </Link>
        </div>
        <div className="w-full  flex justify-between items-center">
           <div className="">
                <div className="stat-title">
                    <div className="uppercase text-sm">FACT-{invoice.id}</div>
                </div>

                <div className=''>
                    <div className="stat-value">
                    {calculTotal()} F
                    </div>
            </div> 


            <div className="stat-desc">
                {invoice.name}
            </div>       

           </div>
                
               
            
            

        </div>

    </div>
  )
}

export default InvoiceComponent
