export function SiteFooter() {
  return (
    <footer className='mt-8 flex w-full flex-col items-center gap-2 px-4 py-6 text-sm text-gray-500 md:py-8'>
      <span>
        © {new Date().getFullYear()} Future of the Youth. All rights reserved.
      </span>
    </footer>
  );
}
