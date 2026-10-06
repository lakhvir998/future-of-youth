import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className='flex w-full justify-center border-b border-gray-200 bg-white px-4 py-6 md:py-8'>
      <Image
        src='/futureofyouth.png'
        alt='Future of the Youth'
        width={160}
        height={160}
        preload
        className='size-40'
      />
    </header>
  );
}
