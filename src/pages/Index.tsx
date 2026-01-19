import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Play,
  FileText,
  Download,
  Zap,
  Shield,
  Globe,
  Clock,
  Video,
  Eye,
  Sparkles,
  Image,
  Send,
  Mail,
} from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setContactForm({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "AI-powered transcription delivers results in seconds, not hours.",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Supports 12+ languages including English, Hindi, Spanish, and more.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are encrypted and auto-deleted after processing.",
    },
    {
      icon: Clock,
      title: "Timestamps",
      description: "Every segment includes precise timestamps for easy navigation.",
    },
    {
      icon: FileText,
      title: "Editable Output",
      description: "Edit, format, and refine your transcript right in the browser.",
    },
    {
      icon: Download,
      title: "Multiple Exports",
      description: "Download as TXT, DOC, JSON, or copy directly to clipboard.",
    },
  ];

  const modes = [
    {
      icon: Video,
      title: "Video Transcription",
      subtitle: "Standard Mode",
      description: "Fast and accurate speech-to-text conversion. Perfect for meetings, lectures, and content creation.",
      features: ["Fast processing", "Multi-language support", "Editable text", "TXT & DOC export"],
      href: "/transcribe",
      gradient: "from-primary to-primary/80",
    },
    {
      icon: Eye,
      title: "Visual Transcription",
      subtitle: "Advanced Mode",
      description: "Get AI-generated visual descriptions alongside your transcript. Ideal for accessibility and detailed analysis.",
      features: ["Frame analysis", "Scene detection", "Visual captions", "JSON & PDF export"],
      href: "/visual-transcribe",
      gradient: "from-accent to-accent/80",
    },
  ];

  const steps = [
    { number: "01", title: "Upload", description: "Drag and drop your video file" },
    { number: "02", title: "Choose Mode", description: "Standard or Visual transcription" },
    { number: "03", title: "Process", description: "Our AI extracts and transcribes" },
    { number: "04", title: "Export", description: "Download in your preferred format" },
  ];

  const faqs = [
    {
      question: "What video formats are supported?",
      answer: "VidScript supports all major video formats including MP4, MOV, AVI, MKV, and WebM. Simply upload your file and our AI will handle the rest."
    },
    {
      question: "What's the difference between Standard and Visual Transcription?",
      answer: "Standard Transcription converts speech to text quickly and accurately. Visual Transcription goes further by analyzing video frames and adding AI-generated visual descriptions alongside the transcript—perfect for accessibility and detailed content analysis."
    },
    {
      question: "Is my video data secure?",
      answer: "Absolutely. Your videos are encrypted during transfer, processed securely, and automatically deleted after transcription is complete. We never store your video content."
    },
    {
      question: "What languages are supported?",
      answer: "We support 12+ languages including English, Hindi, Spanish, French, German, Portuguese, Italian, Dutch, Japanese, Korean, Chinese, and Arabic. Auto-detection is also available."
    },
    {
      question: "How accurate is the transcription?",
      answer: "Our AI-powered transcription achieves over 95% accuracy for clear audio. Accuracy may vary based on audio quality, background noise, and speaker clarity."
    },
    {
      question: "Can I edit the transcript after it's generated?",
      answer: "Yes! All transcripts are fully editable in your browser. You can make corrections, add formatting, and then export in your preferred format."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">AI-Powered Transcription</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Video to Text
              <br />
              <span className="gradient-text">AI Transcription</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Convert video speech into accurate, editable text in seconds. 
              Choose standard or visual mode for enhanced accessibility.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/transcribe">
                <Button size="lg" className="gradient-bg hover:opacity-90 transition-all text-lg px-8 py-6 font-semibold gap-2 group">
                  <Video className="h-5 w-5" />
                  Video Transcription
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/visual-transcribe">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 gap-2 border-accent/50 hover:bg-accent/10">
                  <Eye className="h-5 w-5" />
                  Visual Transcription
                </Button>
              </Link>
            </div>

            {/* Supported Formats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <span className="text-sm text-muted-foreground">Supports:</span>
              {["MP4", "MOV", "AVI", "MKV", "WebM"].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-secondary rounded-lg text-sm font-medium"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two Modes Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Two Powerful Modes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the transcription mode that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <Link
                  key={mode.title}
                  to={mode.href}
                  className="group relative p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.gradient} text-primary-foreground`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {mode.subtitle}
                        </span>
                        <h3 className="font-display text-xl font-bold">{mode.title}</h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {mode.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {mode.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four simple steps to transform your video content into text
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-card p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                  <span className="text-5xl font-display font-bold gradient-text">
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for professional video transcription
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative gradient-bg rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full blur-3xl" />
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-foreground/10 rounded-2xl mb-6">
                <Video className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transcribe?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Start converting your videos to text in seconds. No sign-up required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/transcribe">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 font-semibold gap-2"
                  >
                    <Video className="h-5 w-5" />
                    Standard Mode
                  </Button>
                </Link>
                <Link to="/visual-transcribe">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 font-semibold gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    Visual Mode
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about VidScript
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Mail className="h-4 w-4" />
                  Get in Touch
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Have Questions?
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                <div className="space-y-4 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick response within 24 hours
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Your information is kept private
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      maxLength={1000}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
