import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <Image src="/forged-black.svg" alt="Forged" width={100} height={90} />
            <p className="text-gray-600 text-sm">Create and sell digital playbooks from your knowledge</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Forged. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
