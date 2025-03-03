import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-[#E6EEF9]  relative mx-auto max-w-3xl   sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl  pb-24">
                <main>{children}</main>
            </div>

            <footer className='fixed bottom-0 max-w-3xl flex justify-around items-center mx-auto h-20 bg-white rounded-t-2xl left-0 right-0 shadow-lg'>
                <p className='text-center text-sm text-[#c9d5e1]'>
                    <Link href={route('home')} 
                        className={route().current('home') ? 'text-[#11293c]' : ''}>
                        <i className='fa-solid fa-house text-2xl'></i>
                        <p>홈</p>
                    </Link>
                </p>

                <p className='text-center text-sm text-[#c9d5e1]'>
                    <Link   href={route('memo.view')} 
                        className={route().current('memo.view') ? 'text-[#11293c]' : ''}>
                        <i className="fa-solid fa-note-sticky text-2xl"></i>
                        <p>메모</p>
                    </Link>
                </p>

                <p className='text-center text-sm text-[#c9d5e1]'>
                    <Link href="/home">
                        <i className="fa-solid fa-head-side-virus text-2xl"></i>
                        <p>발달평가</p>
                    </Link>
                </p>

                <p className='text-center text-sm text-[#c9d5e1]'>
                    <Link href="/home">
                        <i className="fa-solid fa-person-running text-2xl"></i>
                        <p>도전행동</p>
                    </Link>
                </p>

                <p className='text-center text-sm text-[#c9d5e1]'>
                    <Link href="/home">
                        <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                        <p>히스토리</p>
                    </Link>
                </p>
            </footer>
        </div>
    );
}
