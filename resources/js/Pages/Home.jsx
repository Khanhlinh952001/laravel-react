import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function home() {
    // Get user information from the auth prop
    const { auth } = usePage().props;
    const user = auth.user;
    const [showDropdown, setShowDropdown] = useState(false);
    
    return (
        <AuthenticatedLayout>
            <Head title="서울대학교병원 치료모니터링" />
            
            <div className="flex justify-between pt-2">
                <div>
                    <h4 className='text-sm'>{user.name}</h4>
                    <p className='text-sm'>kkfkfk</p>
                </div>

                <div className="relative">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}`} 
                        alt="avatar" 
                        className='h-[40px] w-[40px] border-2 border-white rounded-full cursor-pointer' 
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                프로필 설정
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                로그아웃
                            </Link>
                        </div>
                    )}
                </div>
               {/* <div className="bg-white rounded-lg shadow p-6 mb-4"> 
                <h2 className="text-xl font-semibold mb-4">사용자 정보</h2>
                {user && (
                    <div className="space-y-2">
                        <p><span className="font-medium">이름:</span> {user.name}</p>
                        <p><span className="font-medium">이메일:</span> {user.email}</p>
                    </div>
                )}
               </div> */}
            </div>
        </AuthenticatedLayout>
    );
}
