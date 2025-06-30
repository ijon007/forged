import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How do I sell a playbook?",
      answer:
        "Upload a PDF or your notes, set a price, and share a link. We handle payments for you. Our AI automatically extracts key points and creates a structured playbook that's ready to sell.",
    },
    {
      question: "What is a playbook?",
      answer:
        "A playbook is a digital guide that teaches a process step-by-step, like 'How to Plan a Product Launch' or 'How to Crack Marketing for Clients' It's your knowledge packaged into an actionable format that others can follow.",
    },
    {
      question: "How do I get paid?",
      answer:
        "You receive 100% of every sale. Payments are processed through Stripe (via Polar). Set your own pricing and everything that you earn.",
    },
    {
      question: "Can I edit my playbook after it's created?",
      answer:
        "Yes! After the AI generates your playbook, you can edit content, add images, adjust pricing, and personalize every aspect to match your style and brand.",
    },
    {
      question: "What files can I upload to create a playbook?",
      answer:
        "Currently, we support only PDF files. We're working on expanding to support more formats like Word documents and Google Docs.",
    },
    {
      question: "How many playbooks can I create?",
      answer:
        "No limits! With your $5/month subscription, you can upload unlimited PDFs and create as many playbooks as you want. Scale your knowledge business without restrictions.",
    },
  ]

  return (
    <section id="faq" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">FAQ</h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
            Everything you need to know about turning your knowledge into income
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-black hover:text-gray-700 cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
