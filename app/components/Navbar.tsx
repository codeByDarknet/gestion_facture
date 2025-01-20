"use client";

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { Layers } from 'lucide-react';
import { checAnnAddUser } from '../actions';

const Navbar = () => {
    const pathName = usePathname();
    const {user} = useUser();

    const navLinks = [
        { label: 'Factures', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];


    useEffect(() => {    
        if(user?.primaryEmailAddress?.emailAddress && user?.fullName){
           checAnnAddUser(user.primaryEmailAddress.emailAddress,user.fullName)
        }
    }, [user])

    const isActiveLink = (href: string) => {
        return pathName.replace(/\/$/, '') === href.replace(/\/$/, '');
    };

    const renderNavLink = (className: string) =>
        navLinks.map(({ label, href }) => {
            return (
                <Link
                    key={label}
                    href={href}
                    className={
                        ` btn-sm btn
            ${className} ${isActiveLink(href) ? 'btn-accent' : ''
                        }`
                    }
                >
                    {label}
                </Link>
            )
        })



    return (
        
            <div className=" border-b border-base-300 px-5 md:px-[10%] py-4 relative">
                <div className='flex justify-between items-center'>

                    <div className="flex items-center">
                    <div className='bg-accent-content text-accent rounded-full p-2'>
                        <Layers className='h-6 w-6' />
                        </div>
                        <span className='ml-3 font-bold text-2xl italic'>
                            Ges<span className="text-accent">Fac</span>
                        </span>
                    </div >
                    <div className=" flex space-x-4 item-center">
                        {renderNavLink('btn')}
                        <UserButton />
                    </div>
                </div>
            </div>
        
    )
}

export default Navbar
