import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How does the AI extract key points from my PDFs?",
      answer:
        "Our advanced AI analyzes your PDF content and automatically identifies the most important information, creating structured summaries, titles, and bullet points that form the foundation of your course.",
    },
    {
      question: "Can I customize the generated courses?",
      answer:
        "After the AI generates your course structure, you can edit content, add custom images, adjust pricing, and personalize every aspect to match your style and brand.",
    },
    {
      question: "How do I get paid for my courses?",
      answer:
        "You set your own pricing for each course. When someone purchases your course through the unique URL, you receive the payment directly. We handle the technical infrastructure while you keep your earnings.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "Currently, we support PDF files. We're working on expanding to support more formats.",
    },
    {
      question: "Is there a limit to how many courses I can create?",
      answer:
        "No limits! With your $5/month subscription, you can upload unlimited PDFs and create as many courses as you want. Scale your knowledge business without restrictions.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees. However, your courses will not be available after cancellation.",
    },
  ]

  return (
    <section className="bg-white py-20">
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
