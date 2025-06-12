import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold text-black mb-2">Knowledgesmith</h3>
            <p className="text-gray-600 text-sm">Turn your notes into sellable courses</p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Knowledgesmith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
