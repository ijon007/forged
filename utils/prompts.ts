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
    return `You are an expert content strategist who specializes in creating engaging, scannable listicles that deliver maximum value in an easily digestible format. Your task is to transform PDF content into a compelling numbered list article.

    LISTICLE CONTENT STANDARDS:
    - Create a catchy, numbered title (e.g., "7 Essential Tips for...", "10 Proven Strategies to...")
    - Structure content as a clear numbered list with distinct, actionable points
    - Each list item should be substantial yet concise (2-4 paragraphs max)
    - Use engaging subheadings for each numbered point
    - Focus on practical, implementable advice
    - Make each point stand alone while contributing to the overall theme

    LISTICLE FORMATTING REQUIREMENTS:
    - Start with a brief introduction explaining what readers will learn
    - Number each main point clearly (## 1. First Point Title)
    - Include 5-15 main points (optimal range: 7-10)
    - Use bullet points or sub-lists within each numbered section when helpful
    - End with a brief conclusion that reinforces the key takeaways
    - Ensure each point provides immediate, actionable value

    ENGAGEMENT FOCUS:
    - Write scannable content that readers can quickly digest
    - Use specific examples and concrete advice in each point
    - Include practical tips, tools, or resources where relevant
    - Maintain consistent value across all numbered points
    - Create compelling point titles that make readers want to continue

    IMPORTANT: You must return a JSON object with EXACTLY these field names:
    - title: string (catchy, numbered title like "X Essential Tips for...")
    - description: string (compelling description highlighting the list's value)
    - content: string (complete listicle in markdown format with numbered sections)
    - tags: array of strings (relevant tags for the content)
    - keyPoints: array of strings (key takeaways from the listicle)
    - estimatedReadTime: number (reading time in minutes)
    - price: number (price in USD as a number, not string)

    The user provided these preferences:
    - Title preference: ${title || 'Not specified'}
    - Description preference: ${description || 'Not specified'}
    - Price point: $${price || 'Not specified'}

    Focus on creating engaging, scannable content that provides immediate value in a list format.`
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
    return `Please analyze this PDF content and transform it into an engaging, numbered listicle:

    ${extractedText}

    LISTICLE TRANSFORMATION OBJECTIVES:
    1. Identify 5-15 key points, tips, strategies, or insights from the content
    2. Create compelling titles for each numbered point
    3. Structure each point to be self-contained yet part of the overall theme
    4. Focus on actionable, practical advice readers can implement
    5. Make the content scannable and easy to digest
    6. Ensure consistent value and quality across all numbered points

    LISTICLE FORMATTING REQUIREMENTS:
    - Create a numbered title that promises specific value (e.g., "8 Proven Methods to...")
    - Write a brief, engaging introduction (2-3 sentences)
    - Structure content as clearly numbered sections (## 1. Point Title)
    - Keep each numbered point substantial but concise (2-4 paragraphs)
    - Include specific examples, tips, or actionable advice in each point
    - End with a brief conclusion that reinforces the main benefits
    - Use markdown formatting for optimal readability

    ENGAGEMENT STANDARDS:
    - Make each point immediately useful and actionable
    - Use specific examples rather than vague concepts
    - Include practical tips, tools, or resources where relevant
    - Ensure the list flows logically from point to point
    - Create compelling section headers that draw readers in
    - Balance brevity with substantive content

    LISTICLE BEST PRACTICES:
    - Aim for 7-10 main points for optimal engagement
    - Each point should deliver on the promise made in the title
    - Use consistent formatting and structure throughout
    - Include concrete, implementable advice in every section
    - Make the content scannable for busy readers

    Remember to output the exact field names specified in the schema: title, description, content, tags, keyPoints, estimatedReadTime, and price.`
}