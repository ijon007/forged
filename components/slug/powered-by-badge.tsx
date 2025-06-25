import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

const PoweredByBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="https://tryforged.vercel.app" target="_blank">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 shadow-lg"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">Powered by Forged</span>
        </Button>
      </Link>
    </div>
  )
}

export default PoweredByBadge 