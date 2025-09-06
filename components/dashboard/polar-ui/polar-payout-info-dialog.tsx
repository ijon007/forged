import { AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolarPayoutInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgSlug: string;
}

const PolarPayoutInfoDialog = ({
  isOpen,
  onClose,
  orgSlug,
}: PolarPayoutInfoDialogProps) => {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="scrollbar-hide h-svh overflow-y-auto sm:max-w-2xl md:h-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            How to Set Up Your Polar Payouts
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Our platform is integrated with Polar for platform subscriptions and
          user payouts. In the future we will add more payout options.
        </DialogDescription>
        <div className="mt-4 space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Step-by-step payout setup:</strong>
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <strong>Log in to your Polar account: </strong>
              Visit your{" "}
              <a
                className="text-blue-600 underline hover:text-blue-800"
                href="https://polar.sh/dashboard"
                rel="noopener noreferrer"
                target="_blank"
              >
                Polar Dashboard
              </a>{" "}
              and sign in.
            </li>
            <li>
              <strong>Navigate to the Payout Settings: </strong>
              In the dashboard sidebar, click on <strong>Finance</strong> &rarr;{" "}
              <strong>Payouts</strong> or go directly to{" "}
              <a
                className="text-blue-600 underline hover:text-blue-800"
                href={`https://polar.sh/dashboard/${orgSlug}/finance/income`}
                rel="noopener noreferrer"
                target="_blank"
              >
                https://polar.sh/dashboard/{orgSlug}/finance/income
              </a>
              .
            </li>
            <li>
              <strong>Add your payout method: </strong>
              Click <strong>Setup</strong> and follow the prompts to connect
              your bank account or Stripe account. You may need to provide
              identity verification documents depending on your country.
            </li>
            <li>
              <strong>Complete verification: </strong>
              Make sure to complete any identity verification steps required by
              Polar to enable payouts. Then Polar will review your application
              and when its approved you can start receiving payouts.
            </li>
            <li>
              <strong>Request payouts manually: </strong>
              Once your payout method is set up and your balance reaches the
              minimum threshold of $10, you can manually request payouts from
              the <strong>Finance &rarr; Income</strong> page.
            </li>
            <li>
              <strong>Receive funds: </strong>
              After you request a payout, Polar will transfer your earnings
              (minus Polar fees) to your connected payout account.
            </li>
          </ol>

          <p>
            For more detailed information, please refer to the official Polar
            payout documentation or contact us at{" "}
            <a
              className="text-blue-600 underline hover:text-blue-800"
              href="mailto:support@polar.sh"
            >
              forged.help1@gmail.com
            </a>
            :
          </p>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a
              className="text-blue-600 underline hover:text-blue-800"
              href="https://docs.polar.sh/features/finance/accounts"
              rel="noopener noreferrer"
              target="_blank"
            >
              Polar Payouts Documentation
            </a>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full rounded-xl text-center">
            <Link
              href={`https://polar.sh/dashboard/${orgSlug}/finance/income`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to Your Polar Payout Settings
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolarPayoutInfoDialog;
