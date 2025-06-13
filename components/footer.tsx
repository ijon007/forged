export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-black mb-2">Knowledgesmith</h3>
            <p className="text-gray-600 text-sm">Turn your notes into money</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Knowledgesmith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
