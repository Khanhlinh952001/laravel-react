import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="의료진 회원가입" />
            
            <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#2C3E50] px-6 py-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">SNUH 치료모니터링</h2>
                        <p className="text-blue-200">의료진 회원가입</p>
                    </div>

                    {/* Register Form */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                                    이름
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="홍길동"
                                />
                                <InputError message={errors.name} className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                    이메일
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="medical@snuh.org"
                                />
                                <InputError message={errors.email} className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password} className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password_confirmation">
                                    비밀번호 확인
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password_confirmation} className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#2C3E50] text-white py-3 rounded-lg hover:bg-[#34495E] transition duration-200 ease-in-out disabled:opacity-75"
                                >
                                    {processing ? '처리 중...' : '회원가입'}
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                이미 계정이 있으신가요?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    로그인하기
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
