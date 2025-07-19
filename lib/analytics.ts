// Analytics utility functions
export const analytics = {
  // Google Analytics 4
  gtag: (eventName: string, parameters: any = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", eventName, parameters)
    }
  },

  // Mixpanel
  mixpanel: (eventName: string, properties: any = {}) => {
    if (typeof window !== "undefined" && (window as any).mixpanel) {
      ;(window as any).mixpanel.track(eventName, properties)
    }
  },

  // Combined tracking
  track: (eventName: string, properties: any = {}) => {
    analytics.gtag(eventName, properties)
    analytics.mixpanel(eventName, properties)
  },

  // Page view tracking
  pageView: (url: string, title?: string) => {
    analytics.gtag("page_view", {
      page_location: url,
      page_title: title,
    })

    if (typeof window !== "undefined" && (window as any).mixpanel) {
      ;(window as any).mixpanel.track("Page View", {
        url,
        title,
      })
    }
  },

  // User identification
  identify: (userId: string, traits: any = {}) => {
    if (typeof window !== "undefined" && (window as any).mixpanel) {
      ;(window as any).mixpanel
        .identify(userId)(window as any)
        .mixpanel.people.set(traits)
    }
  },
}

// A/B Test utilities
export const abTest = {
  getVariant: (testName: string, variants: string[] = ["A", "B"]): string => {
    const stored = localStorage.getItem(`ab_test_${testName}`)
    if (stored && variants.includes(stored)) {
      return stored
    }

    const variant = variants[Math.floor(Math.random() * variants.length)]
    localStorage.setItem(`ab_test_${testName}`, variant)

    analytics.track("AB Test Assignment", {
      test_name: testName,
      variant,
      timestamp: new Date().toISOString(),
    })

    return variant
  },

  trackConversion: (testName: string, variant: string, conversionType: string) => {
    analytics.track("AB Test Conversion", {
      test_name: testName,
      variant,
      conversion_type: conversionType,
      timestamp: new Date().toISOString(),
    })
  },
}
