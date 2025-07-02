export interface ParsePDFResult {
    success: boolean
    text?: string
    error?: string
}

export async function validatePDFFile(file: File): Promise<{ valid: boolean; error?: string }> {
    if (!file) {
        return { valid: false, error: 'No file provided' }
    }

    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'File must be a PDF' }
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' }
    }

    return { valid: true }
} 