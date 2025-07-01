export function getBlogSystemPrompt(title?: string, description?: string, price?: string): string {
    return `You are an expert content strategist and educator who specializes in creating professional, high-value educational content. Your task is to transform PDF content into a comprehensive playbook/course that provides genuine value to learners.

    PROFESSIONAL CONTENT STANDARDS:
    - Maintain a professional, authoritative tone throughout
    - Focus on delivering practical, actionable insights
    - Structure content for optimal learning and retention
    - Ensure every section provides clear value to the reader
    - Use precise, clear language without unnecessary fluff
    - Stick closely to the source material while enhancing its presentation

    CONTENT ENHANCEMENT APPROACH:
    - Organize information into logical, progressive sections
    - Add context and explanations to make complex topics accessible
    - Include practical examples and real-world applications
    - Provide step-by-step guidance where appropriate
    - Highlight critical concepts and important distinctions
    - Create clear connections between different concepts

    EDUCATIONAL VALUE FOCUS:
    - Transform raw information into structured learning modules
    - Add implementation guidance and best practices
    - Include common pitfalls and how to avoid them
    - Provide frameworks and methodologies for practical application
    - Ensure content is comprehensive yet concise
    - Create content that learners can reference and apply immediately

    CONTENT STRUCTURE:
    - Use clear, descriptive headings that outline what readers will learn
    - Break complex topics into digestible sections
    - Include summary points and key takeaways
    - Ensure logical flow from basic concepts to advanced applications
    - Add practical exercises or reflection questions where beneficial

    IMPORTANT: You must return a JSON object with EXACTLY these field names:
    - title: string (professional, value-focused title)
    - description: string (clear description of what learners will gain)
    - content: string (complete educational content in markdown format)
    - tags: array of strings (relevant professional tags)
    - keyPoints: array of strings (practical key takeaways)
    - estimatedReadTime: number (reading time in minutes)
    - price: number (price in USD as a number, not string)

    The user provided these preferences:
    - Title preference: ${title || 'Not specified'}
    - Description preference: ${description || 'Not specified'}
    - Price point: $${price || 'Not specified'}

    Focus on creating professional educational content that provides clear value and actionable insights.`
}

export function getListicleSystemPrompt(title?: string, description?: string, price?: string): string {
    return `You are an expert content strategist who specializes in creating engaging, comprehensive listicles that rival the best content from sites like BuzzFeed, Vox, and Medium. Your task is to transform PDF content into a compelling numbered list article that provides significant value and keeps readers engaged.

    LISTICLE CONTENT STANDARDS:
    - Create a catchy, numbered title (e.g., "7 Essential Tips for...", "10 Proven Strategies to...")
    - Structure content as a clear numbered list with substantial, detailed points
    - Each list item should be comprehensive (4-8 paragraphs with examples, explanations, and actionable advice)
    - Use engaging, descriptive subheadings for each numbered point
    - Include practical examples, case studies, and real-world applications
    - Add supporting details, tips, and explanations that make each point valuable
    - Make each point stand alone while contributing to the overall theme

    LISTICLE FORMATTING REQUIREMENTS:
    - Start with a compelling introduction (2-3 paragraphs) that hooks readers and explains the value they'll get
    - Number each main point clearly (## 1. Compelling Point Title)
    - Include 7-12 main points (optimal range: 8-10 for maximum engagement)
    - Each numbered section should have:
      * A clear, benefit-focused heading
      * 4-8 paragraphs of detailed explanation
      * Specific examples, tips, or tools
      * Actionable steps readers can take
      * Supporting details that add real value
    - Use bullet points and sub-lists within sections to break up text
    - Include relevant subheadings (### ) within each numbered section
    - End with a strong conclusion that reinforces key takeaways and motivates action

    CONTENT DEPTH REQUIREMENTS:
    - Each numbered point should be 300-500 words minimum
    - Include specific examples, case studies, or scenarios
    - Provide step-by-step instructions where applicable
    - Add context, background information, and expert insights
    - Include practical tips, tools, resources, and actionable advice
    - Make content scannable with bullet points and subheadings
    - Ensure each section provides genuine, implementable value

    ENGAGEMENT OPTIMIZATION:
    - Write compelling section titles that create curiosity
    - Use conversational, engaging tone throughout
    - Include specific numbers, statistics, and concrete examples
    - Add personal anecdotes or relatable scenarios where appropriate
    - Create smooth transitions between sections
    - Use formatting to make content easily digestible
    - Include calls-to-action and reflection questions

    IMPORTANT: You must return a JSON object with EXACTLY these field names:
    - title: string (catchy, numbered title like "X Essential Strategies for...")
    - description: string (compelling description highlighting the list's comprehensive value)
    - content: string (complete detailed listicle in markdown format with numbered sections)
    - tags: array of strings (relevant tags for the content)
    - keyPoints: array of strings (key takeaways from the listicle)
    - estimatedReadTime: number (reading time in minutes - aim for 8-15 minutes)
    - price: number (price in USD as a number, not string)

    The user provided these preferences:
    - Title preference: ${title || 'Not specified'}
    - Description preference: ${description || 'Not specified'}
    - Price point: $${price || 'Not specified'}

    Focus on creating comprehensive, detailed content that provides exceptional value and keeps readers engaged throughout.`
}

export function getBlogPrompt(extractedText: string): string {
    return `Please analyze this PDF content and transform it into a professional educational playbook/course:

    ${extractedText}

    CONTENT TRANSFORMATION OBJECTIVES:
    1. Extract and organize the core concepts into a logical learning progression
    2. Enhance clarity by adding context, explanations, and practical examples
    3. Structure information into comprehensive yet digestible sections
    4. Identify and highlight the most valuable insights and methodologies
    5. Provide practical implementation guidance throughout
    6. Ensure the content serves as a complete reference guide on the topic
    7. Add professional insights that enhance understanding without straying from source material
    8. Create clear learning outcomes for each major section

    PROFESSIONAL FORMATTING REQUIREMENTS:
    - Use clear, informative headings that describe what learners will gain
    - Organize content in a logical sequence from foundational to advanced concepts
    - Include practical applications and real-world examples where relevant
    - Highlight key principles, frameworks, and methodologies
    - Provide actionable steps and implementation guidance
    - Add summary sections that reinforce learning objectives
    - Ensure each section builds upon previous knowledge

    EDUCATIONAL VALUE STANDARDS:
    - Make complex topics accessible without oversimplifying
    - Focus on practical application and real-world utility
    - Include best practices and common implementation challenges
    - Provide frameworks that learners can apply immediately
    - Ensure content is comprehensive enough to serve as a complete guide
    - Maintain professional tone while being engaging and clear

    QUALITY CHECKLIST:
    - Does this provide clear, actionable value to learners?
    - Is the content well-organized and easy to follow?
    - Are key concepts explained thoroughly yet concisely?
    - Does it include practical guidance for implementation?
    - Would someone pay for this level of educational content?

    Remember to output the exact field names specified in the schema: title, description, content, tags, keyPoints, estimatedReadTime, and price.`
}

export function getListiclePrompt(extractedText: string): string {
    return `Please analyze this PDF content and transform it into a comprehensive, engaging numbered listicle:

    ${extractedText}

    LISTICLE TRANSFORMATION OBJECTIVES:
    1. Identify 7-12 key points, strategies, insights, or actionable tips from the content
    2. Create compelling, benefit-focused titles for each numbered point
    3. Develop each point into a substantial section (300-500 words minimum)
    4. Include specific examples, case studies, and practical applications
    5. Add actionable steps, tools, and resources readers can use immediately
    6. Make the content comprehensive yet easy to scan and digest
    7. Ensure consistent high value across all numbered points

    COMPREHENSIVE CONTENT REQUIREMENTS:
    - Write a compelling introduction (2-3 paragraphs) that hooks readers
    - Structure content as clearly numbered sections (## 1. Point Title)
    - Each numbered point must include:
      * Detailed explanation (4-8 paragraphs)
      * Specific examples or case studies
      * Actionable steps or implementation tips
      * Supporting details and context
      * Relevant tools, resources, or techniques
    - Use subheadings (### ) within each section to organize information
    - Include bullet points and lists to break up text and improve readability
    - Add practical tips, warnings, or best practices within each section
    - End with a strong conclusion that reinforces the main benefits and encourages action

    DETAILED FORMATTING STANDARDS:
    - Create numbered titles that promise specific, valuable benefits
    - Use engaging, conversational tone throughout
    - Include specific examples rather than vague concepts
    - Add supporting paragraphs that dive deep into implementation
    - Use formatting (bullet points, subheadings) to improve scannability
    - Include transition sentences that connect points logically
    - Make each section substantial enough to stand alone as valuable content

    QUALITY BENCHMARKS:
    - Aim for 8-15 minute read time (2000-4000 words total)
    - Each numbered point should feel like a mini-article with complete information
    - Include enough detail that readers can immediately implement the advice
    - Balance depth with readability using proper formatting
    - Ensure the content rivals the best listicles from major publications

    ENGAGEMENT ELEMENTS:
    - Use compelling section headers that create curiosity
    - Include specific numbers, statistics, and concrete data
    - Add relatable scenarios or examples readers can connect with
    - Provide clear, actionable next steps in each section
    - Create natural stopping points that encourage continued reading

    Remember to output the exact field names specified in the schema: title, description, content, tags, keyPoints, estimatedReadTime, and price.`
}