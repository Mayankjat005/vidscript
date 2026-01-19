import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { 
  Settings, 
  Palette, 
  Share2, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  Save, 
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { settings, updateSettings, isLoading: settingsLoading } = useSiteSettings();
  
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync(formData);
      toast({
        title: "Settings saved!",
        description: "Your changes have been applied successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const features = [...(formData.features_list || [])];
    features[index] = { ...features[index], [field]: value };
    setFormData({ ...formData, features_list: features });
  };

  const addFeature = () => {
    const features = [...(formData.features_list || [])];
    features.push({ icon: "Zap", title: "", description: "" });
    setFormData({ ...formData, features_list: features });
  };

  const removeFeature = (index: number) => {
    const features = [...(formData.features_list || [])];
    features.splice(index, 1);
    setFormData({ ...formData, features_list: features });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const faqs = [...(formData.faq_content || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setFormData({ ...formData, faq_content: faqs });
  };

  const addFaq = () => {
    const faqs = [...(formData.faq_content || [])];
    faqs.push({ question: "", answer: "" });
    setFormData({ ...formData, faq_content: faqs });
  };

  const removeFaq = (index: number) => {
    const faqs = [...(formData.faq_content || [])];
    faqs.splice(index, 1);
    setFormData({ ...formData, faq_content: faqs });
  };

  const updatePricingTier = (index: number, field: string, value: string | string[]) => {
    const tiers = [...(formData.pricing_tiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    setFormData({ ...formData, pricing_tiers: tiers });
  };

  const addPricingTier = () => {
    const tiers = [...(formData.pricing_tiers || [])];
    tiers.push({ name: "", price: "", features: [] });
    setFormData({ ...formData, pricing_tiers: tiers });
  };

  const removePricingTier = (index: number) => {
    const tiers = [...(formData.pricing_tiers || [])];
    tiers.splice(index, 1);
    setFormData({ ...formData, pricing_tiers: tiers });
  };

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">Content</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={formData.site_name || ""}
                      onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url || ""}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email || ""}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer_text">Footer Text</Label>
                  <Input
                    id="footer_text"
                    value={formData.footer_text || ""}
                    onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>Customize your site colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        className="w-16 h-10 p-1"
                        value={formData.primary_color || "#6366f1"}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      />
                      <Input
                        value={formData.primary_color || ""}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        className="w-16 h-10 p-1"
                        value={formData.secondary_color || "#8b5cf6"}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      />
                      <Input
                        value={formData.secondary_color || ""}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Add your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.social_links?.facebook || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links!, facebook: e.target.value } 
                      })}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.social_links?.twitter || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links!, twitter: e.target.value } 
                      })}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.social_links?.instagram || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links!, instagram: e.target.value } 
                      })}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.social_links?.youtube || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        social_links: { ...formData.social_links!, youtube: e.target.value } 
                      })}
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title || ""}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{(formData.seo_title || "").length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description || ""}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{(formData.seo_description || "").length}/160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_keywords">Keywords (comma separated)</Label>
                  <Input
                    id="seo_keywords"
                    value={formData.seo_keywords || ""}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    placeholder="video transcription, AI, movies"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Tiers</CardTitle>
                <CardDescription>Manage your pricing plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.pricing_tiers?.map((tier, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tier {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removePricingTier(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={tier.name}
                          onChange={(e) => updatePricingTier(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          value={tier.price}
                          onChange={(e) => updatePricingTier(index, "price", e.target.value)}
                          placeholder="999 or Custom"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Features (one per line)</Label>
                      <Textarea
                        value={tier.features.join("\n")}
                        onChange={(e) => updatePricingTier(index, "features", e.target.value.split("\n"))}
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addPricingTier} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pricing Tier
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content (Features & FAQ) */}
          <TabsContent value="content">
            <div className="space-y-6">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>Highlight your product features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.features_list?.map((feature, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Feature {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Icon (Zap, Globe, Shield, Clock, etc.)</Label>
                          <Input
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, "icon", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => updateFeature(index, "title", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFeature} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription>Frequently asked questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.faq_content?.map((faq, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Question {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFaq(index, "question", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, "answer", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFaq} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="gradient-bg">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
