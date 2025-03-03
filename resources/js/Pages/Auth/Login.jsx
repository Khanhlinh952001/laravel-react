import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="의료진 로그인" />
            
            <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#2C3E50] px-6 py-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">SNUH 치료모니터링</h2>
                        <p className="text-blue-200">의료진 로그인</p>
                    </div>

                    {/* Login Form */}
                    <div className="p-6 sm:p-8">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                    이메일
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="medical@snuh.org"
                                />
                                {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">로그인 유지</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-600 hover:text-blue-800 transition"
                                    >
                                        비밀번호 찾기
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#2C3E50] text-white py-3 rounded-lg hover:bg-[#34495E] transition duration-200 ease-in-out disabled:opacity-75"
                            >
                                {processing ? '로그인 중...' : '로그인'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                계정이 없으신가요?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    회원가입
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
