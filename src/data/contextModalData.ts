import type {
  ContextBrandItem,
  ContextField,
  ContextKnowledgeFile,
  ContextKnowledgeLink,
} from '../components/ContextModal/ContextModal.types'

export const DEFAULT_CONTEXT_FIELDS: ContextField[] = [
  {
    id: 1,
    name: 'Provider first name',
    description: 'Name of the business provider',
    source: 'Birdeye',
    group: 'Business',
    sampleData: 'Raynil',
    anonymize: true,
    showInOutput: true,
    enabled: true,
  },
  {
    id: 2,
    name: 'Provider last name',
    description: 'Name of the business provider',
    source: 'Birdeye',
    group: 'Business',
    sampleData: 'Kumar',
    anonymize: true,
    showInOutput: false,
    enabled: true,
  },
  {
    id: 3,
    name: 'Business category',
    description: 'Primary business category',
    source: 'Birdeye',
    group: 'Business',
    sampleData: 'Food',
    anonymize: false,
    showInOutput: true,
    enabled: true,
  },
  {
    id: 4,
    name: 'Service offered',
    description: 'Service the customer received',
    source: 'Zendesk',
    group: 'Business',
    sampleData: 'Consultation',
    anonymize: true,
    showInOutput: true,
    enabled: true,
  },
  {
    id: 5,
    name: 'Business hours',
    description: 'Operating hours of the location',
    source: 'Zendesk',
    group: 'Business',
    sampleData: '10.00 AM - 04.00 PM',
    anonymize: true,
    showInOutput: true,
    enabled: true,
  },
  {
    id: 6,
    name: 'Location email',
    description: 'Primary email of the location',
    source: 'Birdeye',
    group: 'Business',
    sampleData: 'xyz@business.com',
    anonymize: true,
    showInOutput: true,
    enabled: true,
  },
  {
    id: 7,
    name: 'Location phone',
    description: 'Primary phone number of the location',
    source: 'Birdeye',
    group: 'Business',
    sampleData: '+1 415-000-0000',
    anonymize: true,
    showInOutput: false,
    enabled: true,
  },
]

export const DEFAULT_CONTEXT_KNOWLEDGE = {
  files: [{ id: 1, name: 'Product list.PDF' }] as ContextKnowledgeFile[],
  links: [{ id: 1, url: 'https://www.aspendental.com/productsandservices' }] as ContextKnowledgeLink[],
}

export const DEFAULT_CONTEXT_BRAND: ContextBrandItem[] = [
  {
    id: 1,
    name: 'Brand Profile',
    description:
      'Everything about your business including description, mission statement, slogans, market positioning, products & services, competitors, and marketing goals',
    enabled: true,
  },
  {
    id: 2,
    name: 'Target Customers',
    description:
      'Information about your customers including audience overview, buying triggers, value propositions, and key segments',
    enabled: false,
  },
  {
    id: 3,
    name: 'Style and Voice',
    description:
      'Visual and writing style of your business including colors, fonts, imagery style, brand personality, tone of writing, and voice guidelines for emails, social posts, blogs, and reviews',
    enabled: true,
  },
  {
    id: 4,
    name: 'Media',
    description:
      'Media assets including logos, favicons, social images, and other key graphics pulled from the website',
    enabled: false,
  },
  {
    id: 5,
    name: 'Guardrails',
    description:
      "Boundaries for AI including what it should and shouldn't say, topics to avoid, preferred phrases, and any other do's and don'ts to keep content on-brand",
    enabled: false,
  },
]
