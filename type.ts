

import {Invoice as PrismaInvoice} from '@prisma/client';
import {InvoiceLine} from '@prisma/client';

export interface Invoice extends PrismaInvoice {
    lines : InvoiceLine[]
}


export interface Totals {
    totalHT: number
    totalVTA: number
    totalTTC: number
}