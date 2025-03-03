import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="서울대학교병원 치료모니터링" />
            
            <div className="min-h-screen bg-white">
                {/* Header - Tối ưu cho mobile */}
                <header className="bg-[#2C3E50] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:h-16">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <span className="text-xl font-bold">서울대병원-<span className="text-base font-normal sm:text-lg">치료모니터링 시스템</span></span>
                            
                            </div>
                            <nav className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('home')}
                                        className="w-full sm:w-auto text-center hover:text-blue-200 transition"
                                    >
                                        모니터링 대시보드
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="w-full sm:w-auto text-center px-6 py-2 hover:text-blue-200 transition"
                                        >
                                            의료진 로그인
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="w-full sm:w-auto text-center bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition"
                                        >
                                            신규 환자 등록
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content - Tối ưu cho mobile */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                                환자 중심 치료 모니터링
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600">
                                실시간 환자 상태 모니터링과 치료 경과를 체계적으로 관리하는 통합 시스템입니다.
                            </p>
                            <div className="space-y-4 max-w-md mx-auto sm:mx-0">
                                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm sm:text-base">실시간 환자 상태 모니터링</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm sm:text-base">치료 경과 자동 기록</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm sm:text-base">의료진 실시간 소통</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto inline-block bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition text-center"
                                >
                                    시스템 시작하기
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-gray-100 p-6 rounded-lg">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
                                    {/* home preview image */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer - Tối ưu cho mobile */}
                <footer className="bg-gray-50 border-t mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="text-center text-gray-600 text-sm sm:text-base">
                            <p>© 2024 서울대학교병원 치료모니터링 시스템.</p>
                            <p className="mt-2">All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
