import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-gray-200 border-t bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <Image
              alt="Forged"
              height={90}
              src="/forged-black.svg"
              width={100}
            />
            <p className="text-gray-600 text-sm">
              Create and sell digital playbooks from your knowledge
            </p>
          </div>
        </div>

        <div className="mt-6 border-gray-100 border-t pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Forged. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
