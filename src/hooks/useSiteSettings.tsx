import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  tagline: string;
  contact_email: string;
  primary_color: string;
  secondary_color: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  pricing_tiers: Array<{
    name: string;
    price: string;
    features: string[];
  }>;
  features_list: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  faq_content: Array<{
    question: string;
    answer: string;
  }>;
}

const defaultSettings: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  site_name: "MoviesNation",
  logo_url: null,
  tagline: "Video Transcription Made Easy",
  contact_email: "contact@moviesnation.co.in",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  social_links: { facebook: "", twitter: "", instagram: "", youtube: "" },
  footer_text: "© 2025 MoviesNation. All rights reserved.",
  seo_title: "MoviesNation - Video Transcription & Visual Analysis",
  seo_description: "Transform your videos into accurate transcripts with AI-powered transcription.",
  seo_keywords: "video transcription, AI transcription, movies, subtitles",
  pricing_tiers: [],
  features_list: [],
  faq_content: [],
};

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return defaultSettings;
      }

      return {
        ...data,
        social_links: data.social_links as SiteSettings["social_links"],
        pricing_tiers: data.pricing_tiers as SiteSettings["pricing_tiers"],
        features_list: data.features_list as SiteSettings["features_list"],
        faq_content: data.faq_content as SiteSettings["faq_content"],
      } as SiteSettings;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<SiteSettings>) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update(newSettings)
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    updateSettings,
  };
};
