"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  Vehicle,
  NewsItem,
  CustomerInquiry,
  Testimonial,
  FAQ,
  ContentPage,
  BusinessSettings,
  AnalyticsData,
  initialVehicles,
  initialNews,
  VehicleStatus,
} from "./data";

interface StoreContextType {
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  toggleFeatured: (id: string) => void;
  updateViewCount: (id: string, count: number) => void;

  // News
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, "id">) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // Customer Inquiries
  inquiries: CustomerInquiry[];
  addInquiry: (inquiry: Omit<CustomerInquiry, "id">) => void;
  updateInquiry: (id: string, inquiry: Partial<CustomerInquiry>) => void;
  deleteInquiry: (id: string) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  publishTestimonial: (id: string) => void;

  // FAQs
  faqs: FAQ[];
  addFAQ: (faq: Omit<FAQ, "id">) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;

  // Content Pages
  contentPages: ContentPage[];
  addContentPage: (page: Omit<ContentPage, "id">) => void;
  updateContentPage: (id: string, page: Partial<ContentPage>) => void;
  deleteContentPage: (id: string) => void;

  // Business Settings
  settings: BusinessSettings;
  updateSettings: (settings: Partial<BusinessSettings>) => void;

  // Analytics
  analytics: AnalyticsData[];
  recordAnalytics: (data: AnalyticsData) => void;

  // Combined stats for dashboard
  getDashboardStats: () => {
    totalVehicles: number;
    available: number;
    rented: number;
    sold: number;
    totalInquiries: number;
    newInquiries: number;
    totalPublishedTestimonials: number;
    totalPageViews: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Default business settings
const defaultSettings: BusinessSettings = {
  businessName: "AutoSharm",
  phone: "+201055777826",
  email: "sharmrental@gmail.com",
  address: "Sharm El Sheikh, South Sinai, Egypt",
  workingHours: {
    weekdays: { start: "09:00", end: "18:00" },
    weekends: { start: "10:00", end: "20:00" },
  },
  socialMedia: {
    instagram: "autosharm.eg",
    facebook: "autosharm",
    whatsapp: "+201055777826",
  },
  defaultPolicy: "All rentals include basic insurance and 24/7 roadside assistance.",
  paymentMethods: ["Cash", "Credit Card", "WhatsApp Payment"],
  insuranceIncluded: true,
  cancellationPolicy: "Free cancellation up to 24 hours before booking",
};

// LocalStorage keys
const STORAGE_KEYS = {
  VEHICLES: "autosharm_vehicles",
  NEWS: "autosharm_news",
  INQUIRIES: "autosharm_inquiries",
  TESTIMONIALS: "autosharm_testimonials",
  FAQS: "autosharm_faqs",
  CONTENT_PAGES: "autosharm_content_pages",
  SETTINGS: "autosharm_settings",
  ANALYTICS: "autosharm_analytics",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (storedVehicles) setVehicles(JSON.parse(storedVehicles));

      const storedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (storedNews) setNews(JSON.parse(storedNews));

      const storedInquiries = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (storedInquiries) setInquiries(JSON.parse(storedInquiries));

      const storedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));

      const storedFAQs = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (storedFAQs) setFAQs(JSON.parse(storedFAQs));

      const storedContentPages = localStorage.getItem(STORAGE_KEYS.CONTENT_PAGES);
      if (storedContentPages) setContentPages(JSON.parse(storedContentPages));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
      } catch (error) {
        console.error("Error saving vehicles to localStorage:", error);
      }
    }
  }, [vehicles, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
      } catch (error) {
        console.error("Error saving news to localStorage:", error);
      }
    }
  }, [news, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      } catch (error) {
        console.error("Error saving inquiries to localStorage:", error);
      }
    }
  }, [inquiries, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      } catch (error) {
        console.error("Error saving testimonials to localStorage:", error);
      }
    }
  }, [testimonials, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
      } catch (error) {
        console.error("Error saving FAQs to localStorage:", error);
      }
    }
  }, [faqs, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CONTENT_PAGES, JSON.stringify(contentPages));
      } catch (error) {
        console.error("Error saving content pages to localStorage:", error);
      }
    }
  }, [contentPages, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error("Error saving settings to localStorage:", error);
      }
    }
  }, [settings, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
      } catch (error) {
        console.error("Error saving analytics to localStorage:", error);
      }
    }
  }, [analytics, isHydrated]);

  // Vehicle management
  const addVehicle = (vehicle: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      viewCount: 0,
      inquiries: 0,
      isFeatured: false,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const toggleFeatured = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, isFeatured: !v.isFeatured } : v
      )
    );
  };

  const updateViewCount = (id: string, count: number) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, viewCount: count } : v))
    );
  };

  // News management
  const addNews = (newsItem: Omit<NewsItem, "id">) => {
    const newNews: NewsItem = {
      ...newsItem,
      id: Date.now().toString(),
    };
    setNews((prev) => [newNews, ...prev]);
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // Customer Inquiry management
  const addInquiry = (inquiry: Omit<CustomerInquiry, "id">) => {
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: Date.now().toString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const updateInquiry = (id: string, updates: Partial<CustomerInquiry>) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  // Testimonial management
  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
    };
    setTestimonials((prev) => [...prev, newTestimonial]);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const publishTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isPublished: !t.isPublished } : t
      )
    );
  };

  // FAQ management
  const addFAQ = (faq: Omit<FAQ, "id">) => {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
    };
    setFAQs((prev) => [...prev, newFAQ]);
  };

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setFAQs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const deleteFAQ = (id: string) => {
    setFAQs((prev) => prev.filter((f) => f.id !== id));
  };

  // Content Page management
  const addContentPage = (page: Omit<ContentPage, "id">) => {
    const newPage: ContentPage = {
      ...page,
      id: Date.now().toString(),
    };
    setContentPages((prev) => [...prev, newPage]);
  };

  const updateContentPage = (id: string, updates: Partial<ContentPage>) => {
    setContentPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteContentPage = (id: string) => {
    setContentPages((prev) => prev.filter((p) => p.id !== id));
  };

  // Business Settings
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Analytics
  const recordAnalytics = (data: AnalyticsData) => {
    setAnalytics((prev) => [...prev, data]);
  };

  // Dashboard stats
  const getDashboardStats = () => ({
    totalVehicles: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    sold: vehicles.filter((v) => v.status === "sold").length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((i) => i.status === "new").length,
    totalPublishedTestimonials: testimonials.filter((t) => t.isPublished).length,
    totalPageViews: vehicles.reduce((sum, v) => sum + (v.viewCount || 0), 0),
  });

  return (
    <StoreContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        updateVehicleStatus,
        toggleFeatured,
        updateViewCount,
        news,
        addNews,
        updateNews,
        deleteNews,
        inquiries,
        addInquiry,
        updateInquiry,
        deleteInquiry,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        publishTestimonial,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        contentPages,
        addContentPage,
        updateContentPage,
        deleteContentPage,
        settings,
        updateSettings,
        analytics,
        recordAnalytics,
        getDashboardStats,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
