import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center space-y-10 h-[60vh]'>
      <h1 className='text-5xl font-bold'>404</h1>
      <span className='text-lg font-bold'> page is not found </span>
      <Link href='/'>
        <Button className='cursor-pointer bg-blue-400' variant={"outline"}>
          Home Page
        </Button>
      </Link>
    </div>
  );
}
