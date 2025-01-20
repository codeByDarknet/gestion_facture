
"use client";

import React, { useEffect, useState } from 'react'
import { Invoice, Totals } from '@/type'
import { deleteInvoice, getInvoiceById, updateInvoice } from '@/app/actions';
import Wrapper from '@/app/components/Wrapper';
import { Save, Trash } from 'lucide-react';
import InvoiceInfo from '@/app/components/InvoiceInfo';
import VTAControl from '@/app/components/VTAControl';
import InvoiceLines from '@/app/components/InvoiceLines';
import { useRouter } from 'next/navigation';
import InvoicePDF from '@/app/components/InvoicePDF';


const Page = ({ params }: { params: Promise<{ invoiceId: string }> }) => {

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
    const [totals, setTotals] = useState<Totals | null>(null);
    const [isSaveDesable, setIsSaveDesable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();


    const fetchInvoice = async () => {
        try {
            const { invoiceId } = await params;
            const fetchInvoice = await getInvoiceById(invoiceId);
            if (fetchInvoice) {
                setInvoice(fetchInvoice);
                setInitialInvoice(fetchInvoice);
            }
        } catch (error) {
            console.error(error);
        }
    };



    useEffect(() => {
        fetchInvoice();
    }, []);


    useEffect(() => {
        if (!invoice) return;

        const ht = invoice.lines.reduce((acc, { quantity, unitPrice }) =>
            acc + quantity * unitPrice, 0
        )
        const vat = invoice.vatActive ? ht * (invoice.vatRate / 100) : 0
        const total = ht + vat

        setTotals({ totalHT: ht, totalVTA: vat, totalTTC: total });


    }, [invoice]);


    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = parseInt(e.target.value);
        if (invoice) {
            const updatedInvoice = { ...invoice, status: newStatus };
            setInvoice(updatedInvoice);
        }

    }

    useEffect(() => {
        setIsSaveDesable(JSON.stringify(invoice) === JSON.stringify(initialInvoice));
    }, [invoice, initialInvoice]);


    const handleSave = async () => {
        if (!invoice) {
            return
        }
        setIsLoading(true)

        try {
            await updateInvoice(invoice);
            const updatedInvoice = await getInvoiceById(invoice.id);
            if (updatedInvoice) {
                setInvoice(updatedInvoice);
                setInitialInvoice(updatedInvoice);
            }
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }

    }

    const handleDelete = async () => {
        const confirm = window.confirm("Voulez-vous vraiment supprimer cette facture ?")


       if(confirm ){
        try {
           await deleteInvoice(invoice?.id as string)
            router.push("/")
        } catch (error) {
            console.error('error lors de la supression de la facture', error);
        }
       }
    }


    if (!invoice || !totals) {
        return (
            <div className=" flex justify-center items-center h-screen w-full">
                <span className="font bold">
                    Facture introuvable
                </span>
            </div>
        )
    }





    return (
        <Wrapper>
            <div className="">
                <div className="flex  flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <p className=" badge badge-ghost badge-lg uppercase">
                        <span className="">Facture-<span className="">{invoice?.id}</span></span>
                    </p>
                    <div className="flex md:mt-4">
                        <select
                            name=""
                            id=""
                            className='select select-sm select-bordered   w-full '
                            value={invoice?.status}
                            onChange={handleStatusChange}
                        >

                            <option value={1}>Brouillon</option>
                            <option value={2}>En attente</option>
                            <option value={3}>Payée</option>
                            <option value={4}>Annulée</option>
                            <option value={5}>Impayée</option>
                        </select>


                        <button className='btn btn-sm btn-accent ml-4'
                            disabled={isSaveDesable || isLoading}
                            onClick={handleSave}
                        >
                            {isLoading ?
                                (<span className="loading loading-spinner loading-sm"></span>) : (
                                    <>
                                        Sauvegarder
                                        <Save className="w-4"/>
                                    </>
                                )}

                        </button>

                        <button className='btn btn-sm btn-accent m-4'
                        onClick={handleDelete}
                        >
                            <Trash className='w-4 ' />
                        </button>

                    </div>

                </div>

                <div className="flex flex-col md:flex-row w-full">
                    <div className="flex w-full md:w-1/3 flex-col">
                        <div>

                            <div className="mb-4 bg-base-200 rounded-xl p-5">
                                <div className=" flex justify-between items-center mb-4">
                                    <div className="badge badge-accent">Resumé des totaux</div>
                                    <VTAControl invoice={invoice} setInvoice={setInvoice} />

                                </div>


                                <div className="flex justify-between">
                                    <span>Total Hors Taxe
                                    </span>
                                    <span>{totals?.totalHT.toFixed(2)} FCFA</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>TVA ({invoice.vatActive ? `${invoice.vatRate}` : "0"} %)</span>
                                    <span>{totals?.totalVTA.toFixed(2)} FCFA</span>
                                </div>


                                <div className="flex justify-between font-bold ">
                                    <span>Total TTC
                                    </span>
                                    <span>{totals?.totalTTC.toFixed(2)} FCFA</span>
                                </div>
                            </div>
                            <InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
                        </div>
                    </div>
                    <div className="flex w-full md:w-2/3 flex-col md:ml-4">
                        <InvoiceLines invoice={invoice} setInvoice={setInvoice} />
                        <InvoicePDF invoice={invoice} totals={totals}  />
                        
                    </div>
                </div>


            </div>
        </Wrapper>
    )
}

export default Page
