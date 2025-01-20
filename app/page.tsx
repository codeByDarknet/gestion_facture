"use client";

import Wrapper from "./components/Wrapper";
import { Layers } from "lucide-react";
import {  useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createEmptyInvoice, getInvoicesByEmail } from "./actions";
import confeti from "canvas-confetti";
import { Invoice } from "@/type";
import InvoiceComponent from "./components/InvoiceComponent";

export default function Home() {
  const {user} = useUser();
  const [invoiceNames, setInvoiceNames] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);



  const email = user?.primaryEmailAddress?.emailAddress as string;
//  fonction pour afficher les factures


const fetchInvoices = async () => {
  try {
    const invoicesData = await getInvoicesByEmail(email);
    if(invoicesData){
      setInvoices(invoicesData);
    }
   
   
  } catch (error) {
    console.error(error);
  }
};


// fonction pour creer une facture
const handleCreateInvoice = async () => {
  try {
    if(email){
      await createEmptyInvoice(email,invoiceNames);
    }

    setInvoiceNames("");

    fetchInvoices();
    
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    

    if (modal) {
      modal.close();
      
    }
    confeti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 1000,
    })

   

  } catch (error) {
    console.error("erreur   lors de la creation de la facture", error)
  }
}

useEffect(() => {
  fetchInvoices();
}, [email,fetchInvoices]);




  return (
    <div className="" >
      <Wrapper >

        <div className="flex flex-col space-y-4">
          <h1 className="text-lg font bold">Mes factures</h1>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="cursor-pointer border border-accent rounded-xl flex justify-center items-center flex-col p-5"
              onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
              <div className=" font-bold text-accent">
                Creer une facture
                <div className="bg-accent-content text-accent rounded-full p-2 flex justify-center items-center">
                  <Layers className="w-6 h-6" />
                 
                </div>
              </div>
            </div>

            {invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <div className="" key={index}>
                    <InvoiceComponent  invoice={invoice}/>
                </div>
              ))
            ) : (
              <p className="text-center">Aucune facture</p>
            )}

          </div>

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                onClick={() => setInvoiceNames("")}>✕</button>
              </form>
              <h3 className="font-bold text-lg">Nouvelle facture</h3>

              <input
                type="text"
                id=""
                value={invoiceNames}
                placeholder="Nom de la facture (60 caractères max)"
                className="input input-bordered w-full my-4"
                onChange={(e) => {
                  setInvoiceNames(e.target.value);
                  setIsNameValid(e.target.value.length <= 60);
                }}
              />
              {!isNameValid && (
                <p className="text-red-500">Le nom de la facture ne doit pas dépasser 60 caractères</p>
              )}


              <button
                disabled={!isNameValid}
                className="btn btn-accent mt-4 w-full"
                onClick={handleCreateInvoice}
              >
                Enregistrer
              </button>


            </div>
          </dialog>
        </div>

      </Wrapper>
    </div>
  );
}
