import { Link } from "react-router-dom";
import { Video, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-8 w-auto" />
              ) : (
                <div className="gradient-bg p-2 rounded-lg">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <span className="font-display font-bold text-lg">{settings.site_name}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {settings.tagline}. Transform your video content into accurate, editable text with our AI-powered 
              transcription service. Fast, accurate, and secure.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/transcribe" className="text-muted-foreground hover:text-foreground transition-colors">
                  Transcribe
                </Link>
              </li>
              <li>
                <Link to="/visual-transcribe" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visual Transcription
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {settings.footer_text}
          </p>
          <div className="flex items-center gap-4">
            {settings.social_links?.twitter && (
              <a
                href={settings.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {settings.social_links?.facebook && (
              <a
                href={settings.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings.social_links?.instagram && (
              <a
                href={settings.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.social_links?.youtube && (
              <a
                href={settings.social_links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
