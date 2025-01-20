"use server";

import prisma from "@/lib/prisma";
import { Invoice } from "@/type";
import { randomBytes } from "crypto";


// fonction qui permet de verifier si un utilisateur existe et l'ajoute si il n'existe pas
export async function checAnnAddUser(email: string,name : string) {
    if(!email){
        return
    }
    try {
        const existingUser = await prisma.user.findUnique(
            {where : {
                email : email
            },}
        )
            
        if(!existingUser && name){
            await prisma.user.create({
                data : {
                    email : email,
                    name : name
                }
            })
        } else {

        }
        
        
    } catch (error) {
        console.error(error)
    }
}


// fonction qui genere des ID unique pour les factures
const generateInvoiceId =  async () => {
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
        uniqueId = randomBytes(3).toString("hex");
        const existingInvoice = await prisma.invoice.findUnique({
            where: {
                id: uniqueId,
            },
        });
        if (!existingInvoice) {
            isUnique = true;
        }
    }
    return uniqueId;
};

// fonction qui cree une facture vide daborb 
export async function createEmptyInvoice(email: string, name : string) {
    try {
       const user = await prisma.user.findUnique({
        where : {
            email : email
        }
       })
       

       const invoiceId = await generateInvoiceId() as string;

       if(user){
        const newInvoice = await prisma.invoice.create({
            data : {
                id : invoiceId,
                name : name,
                userId : user?.id,
                issuerName : "",
                issuerAddress : "",
                clientName : "",
                clientAddress : "",
                invoiceDate :"",
                dueDate : "",
                vatActive : false,
                vatRate : 20,
                status : 1,
            }
           })
       }


       
       
    } catch (error) {
        console.error(error)
    }
}


//  fonction qui permet de recuperer les factures d'un utilisateur
export async function getInvoicesByEmail(email: string) {
    if (!email) {
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where : {
                email : email
            },
            include : {
                invoices : {
                    include : {
                        lines : true
                    },
                },
            }
        })

        // status possibles
            // status 1 = brouillon
            // status 2 =  en attente
            // status 3 = payé
            // status 4 = annulé
            // status 5 = impayé
        if(user){

            const today = new Date();

            const updatedInvoices =  await Promise.all(
                user.invoices.map((invoice) => {
                const dueDate = new Date(invoice.dueDate);
                if(today > dueDate && invoice.status === 2){
                   const updatedInvoice = prisma.invoice.update({
                        where : {
                            id : invoice.id
                        },
                        data : {
                            status : 5,
                            
                        },
                        include: {
                            lines : true
                        }
                    })
                    return updatedInvoice
                }
                return invoice
            })

            );
            

            return updatedInvoices;
            

           
        }
    } catch (error) {
        
    }
}


// fonction qui permet de recuperer une facture par son ID ainsi que les details

export async function getInvoiceById(id: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where : {
                id : id
            }, 
            // le include  ici concerne la table ne lien avec 
            include : {
                lines : true
            }
        })

        if(!invoice){
            throw new Error("Facture introuvable")
        }   
        return invoice
    } catch (error) {
        console.error("une erreur est survenue ", error)
    }
}


export async function updateInvoice(invoice : Invoice) {
    try {
        const existingInvoice = await prisma.invoice.findUnique({
            where : {
                id : invoice.id
            }, 
            // le include  ici concerne la table ne lien avec 
            include : {
                lines : true
            }
        })

        if(!existingInvoice){   
            throw new Error(`facture avec L'ID ${invoice.id} introuvable`)
        }


        await prisma.invoice.update({
            where : {
                id : invoice.id
            }, 
            data : {
                issuerName : invoice.issuerName,
                issuerAddress : invoice.issuerAddress,
                clientName : invoice.clientName,
                clientAddress : invoice.clientAddress,
                invoiceDate : invoice.invoiceDate,
                dueDate : invoice.dueDate,
                vatActive : invoice.vatActive,
                vatRate : invoice.vatRate,
                status : invoice.status
            }
        })
        const existinLines = existingInvoice.lines 
        const receivedLines = invoice.lines

       const linesToDelete = existinLines.filter((line) => {
            return !receivedLines.some((receivedLine) => {
                return receivedLine.id === line.id;
            });
        });

        if (linesToDelete.length > 0) {
            await prisma.invoiceLine.deleteMany({
                where: {
                    id: {
                        in: linesToDelete.map((line) => line.id),
                    },
                },
            });
        }

        for(const line of receivedLines){
            const existingLine = existinLines.find((l) => l.id === line.id)

            if(existingLine){
                const hasChanged =
                line.description !==existingLine.description ||
                line.quantity !== existingLine.quantity ||
                line.unitPrice !== existingLine.unitPrice;

                if(hasChanged){
                    await prisma.invoiceLine.update({
                        where : {
                            id : line.id
                        },
                        data : {
                            description : line.description,
                            quantity : line.quantity,
                            unitPrice : line.unitPrice
                        }
                    })
                }

            } else {
                await prisma.invoiceLine.create({
                    data : {
                        description : line.description,
                        quantity : line.quantity,
                        unitPrice : line.unitPrice,
                        invoiceId : invoice.id
                    }
                })
            }
        }

    } catch (error) {
        console.error("une erreur est survenue lors de la mise a jour de la facture", error)
    }
}


export async function deleteInvoice(invoiceId : string){
    try {
       const deletedInvoice = await prisma.invoice.delete({
            where : {
                id : invoiceId
            }
        })

        if(!deletedInvoice){
            throw new Error("Facture introuvable")
        }
    } catch (error) {
        console.error("une erreur est survenue lors de la suppression de la facture", error)
    }
}