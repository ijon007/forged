import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PoweredByBadge = () => {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Link href="https://www.tryforged.me" target="_blank">
        <Button
          className="border-purple-200 bg-white/80 text-purple-700 shadow-lg backdrop-blur-sm hover:bg-purple-50 hover:text-purple-800"
          size="sm"
          variant="outline"
        >
          <Sparkles className="mr-1 h-3 w-3" />
          <span className="font-medium text-xs">Powered by Forged</span>
        </Button>
      </Link>
    </div>
  );
};

export default PoweredByBadge;
