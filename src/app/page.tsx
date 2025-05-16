import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function Page() {
  return (
    <main className='flex min-h-screen justify-center items-center flex-col p-6'>
      <div className='grid gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-md md:px-20'>
        <Link
          href='/auth/login'
          className='flex justify-center items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base'
        >
          <span>Log in</span> <ArrowRight className='w-5 md:w-6' />
        </Link>
      </div>
    </main>
  );
}
