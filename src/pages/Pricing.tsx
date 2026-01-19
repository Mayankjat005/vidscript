import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    icon: Zap,
    features: [
      "5 video transcriptions/month",
      "Max 5 min per video",
      "Standard transcription only",
      "TXT export",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For content creators and professionals",
    icon: Crown,
    features: [
      "50 video transcriptions/month",
      "Max 60 min per video",
      "Visual transcription included",
      "All export formats",
      "Priority processing",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations",
    icon: Building2,
    features: [
      "Unlimited transcriptions",
      "No duration limits",
      "Advanced visual analysis",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col p-8 rounded-2xl border transition-all duration-300",
                    plan.popular
                      ? "border-primary bg-card shadow-glow scale-105"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-semibold text-primary-foreground gradient-bg rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2 rounded-xl",
                      plan.popular ? "gradient-bg" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        plan.popular ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                    </div>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "gradient-bg hover:opacity-90"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* FAQ Teaser */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground">
              Have questions? Check out our{" "}
              <a href="#" className="text-primary hover:underline">FAQ</a>
              {" "}or{" "}
              <a href="#" className="text-primary hover:underline">contact support</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
