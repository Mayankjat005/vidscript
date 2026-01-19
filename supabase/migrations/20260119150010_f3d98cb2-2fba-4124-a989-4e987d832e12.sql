-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create site_settings table for editable branding
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'MoviesNation',
    logo_url TEXT,
    tagline TEXT DEFAULT 'Video Transcription Made Easy',
    contact_email TEXT DEFAULT 'contact@moviesnation.co.in',
    primary_color TEXT DEFAULT '#6366f1',
    secondary_color TEXT DEFAULT '#8b5cf6',
    social_links JSONB DEFAULT '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}',
    footer_text TEXT DEFAULT '© 2025 MoviesNation. All rights reserved.',
    seo_title TEXT DEFAULT 'MoviesNation - Video Transcription & Visual Analysis',
    seo_description TEXT DEFAULT 'Transform your videos into accurate transcripts with AI-powered transcription. Supports 12+ languages with visual scene detection.',
    seo_keywords TEXT DEFAULT 'video transcription, AI transcription, visual transcription, movies, subtitles',
    pricing_tiers JSONB DEFAULT '[{"name": "Free", "price": "0", "features": ["5 videos/month", "Standard transcription", "TXT export"]}, {"name": "Pro", "price": "999", "features": ["Unlimited videos", "Visual transcription", "All export formats", "Priority support"]}, {"name": "Enterprise", "price": "Custom", "features": ["Custom integrations", "API access", "Dedicated support", "SLA guarantee"]}]',
    features_list JSONB DEFAULT '[{"icon": "Zap", "title": "Lightning Fast", "description": "AI-powered transcription delivers results in seconds, not hours."}, {"icon": "Globe", "title": "Multi-Language", "description": "Supports 12+ languages including English, Hindi, Spanish, and more."}, {"icon": "Shield", "title": "Secure & Private", "description": "Your files are encrypted and auto-deleted after processing."}]',
    faq_content JSONB DEFAULT '[{"question": "What video formats are supported?", "answer": "MoviesNation supports all major video formats including MP4, MOV, AVI, MKV, and WebM."}, {"question": "Is my video data secure?", "answer": "Absolutely. Your videos are encrypted during transfer, processed securely, and automatically deleted after transcription."}]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Authenticated users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete site settings"
ON public.site_settings
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for site_settings
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings row
INSERT INTO public.site_settings (id, site_name) VALUES ('00000000-0000-0000-0000-000000000001', 'MoviesNation');