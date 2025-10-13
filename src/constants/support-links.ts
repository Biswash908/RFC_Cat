export interface SupportLink {
    id: string
    title: string
    icon: string
    action: "link" | "email" | "navigate"
    value: string
  }
  
  export const supportLinks: SupportLink[] = [
    {
      id: "terms",
      title: "Terms and Conditions",
      icon: "file-text-o",
      action: "link",
      value: "http://makethingsunlimited.com/terms-and-conditions/",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "lock",
      action: "link",
      value: "http://makethingsunlimited.com/privacy-policy/",
    },
    {
      id: "email",
      title: "Send us an Email",
      icon: "envelope",
      action: "email",
      value: "support@makethingsunlimited.com",
    },
    {
      id: "app-faqs",
      title: "App FAQs",
      icon: "question-circle",
      action: "navigate",
      value: "FAQScreen",
    },
    {
      id: "raw-feeding-faqs",
      title: "Raw Feeding FAQs",
      icon: "cutlery",
      action: "navigate",
      value: "RawFeedingFAQScreen",
    },
  ]
  