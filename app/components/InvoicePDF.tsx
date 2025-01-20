import { Invoice, Totals } from '@/type'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import { ArrowDownFromLine, Layers } from 'lucide-react'
import React, { useRef } from 'react'

interface FacturePDFProps {
    invoice: Invoice
    totals: Totals
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }
    return date.toLocaleDateString('fr-FR', options);
}


const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {

    const factureRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
       const element = factureRef.current;
       try {
        
        const canvas = await html2canvas(element, { scale: 3, useCORS: true })
        const imgData = canvas.toDataURL('image/png')


        const PDF = new jsPDF({
            orientation : 'p',
            unit : 'mm',
            format : 'a4'
        })
        const pdfWidth = PDF.internal.pageSize.getWidth();
        const pdfHeight =  (canvas.height * pdfWidth) / canvas.width;
        PDF.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        PDF.save(`fature_${invoice.name}.pdf`);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 1000,
        })

       } catch (error) {
        console.error("erreur lors de la generation du pdf",error);
       }
    };
    return (
        <div className='mt-4 hidden lg:block'>
            <div className="border-base-300 border-dashed rounded-xl p-5 border-2 ">

                <button className='btn btn-sm btn-accent mb-4'
                onClick={handleDownloadPdf}
                >
                    Facture PDF
                    <ArrowDownFromLine className="w-4" />
                </button>

                <div className="p-8 "ref={factureRef}>

                    <div className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">

                            <div>
                                <div className="flex items-center">

                                    <div className="bg-accent-content text-accent rounded-full p-2">
                                        <Layers className="w-6 h-6" />
                                    </div>

                                    <span className="font-bold ml-3 text-2xl italic">
                                        Ges<span className='text-accent'>Fac</span>
                                    </span>
                                </div>

                            </div>

                            <h1 className="text-2xl font-bold upercase">Facture</h1>

                        </div>
                        <div className="text-right uppercase">
                            <p className="badge badge-ghost ">
                                Facture N° {invoice.id}
                            </p>

                            <p className="my-2">
                                <strong>Date </strong>
                                {formatDate(invoice.invoiceDate)}
                            </p>
                            <p className="">
                                <strong>Date d&apos;echéance </strong>
                                {formatDate(invoice.dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className="my-4 flex justify-between">
                        <div>
                            <p className="badge badge-ghost mb-2">Emetteur</p>
                            <p className='text-sm font-bold italic'>{invoice.issuerName}</p>
                            <p className='text-sm text-gray-500 w-52 break-world'>{invoice.issuerAddress}</p>
                        </div>
                        <div className='text-right'>
                            <p className="badge badge-ghost mb-2">Client</p>
                            <p className='text-sm font-bold italic'>{invoice.clientName}</p>
                            <p className='text-sm text-gray-500 w-52 break-worlds'>{invoice.clientAddress}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className='table table-zebra'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Désignation</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.lines.map((line, index) => (
                                    <tr key={index + 1}>
                                        <td>{index + 1}</td>
                                        <td>{line.description}</td>
                                        <td>{line.quantity}</td>
                                        <td>{line.unitPrice} FCFA</td>
                                        <td>{line.quantity * line.unitPrice} FCFA</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                    <div className='mt-6 space-y2 text-md'>

                        <div className='flex justify-between'>
                            <div className="font-bold">Total Hors Taxe</div>
                            <div>{totals.totalHT} FCFA</div>
                        </div>

                        {invoice.vatActive && (
                            <div className='flex justify-between'>
                                <div className="font-bold">TVA {invoice.vatRate}%</div>
                                <div>{totals.totalVTA} FCFA</div>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <div className="font-bold">Total TTC</div>
                            <div className='badge badge-accent'>{totals.totalTTC} FCFA</div>
                        </div>

                     </div>


                </div>

            </div>
        </div>
    )
}

export default InvoicePDF
