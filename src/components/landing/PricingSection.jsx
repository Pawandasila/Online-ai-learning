"use client";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  CheckCircle,
  Sparkles,
  Zap,
  Crown
} from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Choose Your <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-rose-600 bg-clip-text text-transparent">Learning Plan</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core AI-powered learning features.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$0",
              period: "forever",
              description: "Perfect for curious beginners",
              features: [
                "3 AI-generated courses monthly",
                "Basic content curation",
                "YouTube video integration",
                "Progress tracking dashboard",
                "Community forum access"
              ],
              popular: false,
              buttonText: "Get Started Free",
              buttonVariant: "outline",
              icon: Sparkles,
              gradient: "from-slate-500 to-slate-600"
            },
            {
              name: "Pro Learner",
              price: "$19",
              period: "per month", 
              description: "For dedicated skill builders",
              features: [
                "Unlimited course generation",
                "Advanced AI personalization",
                "Priority content curation",
                "Custom learning templates",
                "Advanced analytics dashboard",
                "Premium certificate generation",
                "Priority community support"
              ],
              popular: true,
              buttonText: "Get Started",
              buttonVariant: "default",
              icon: Zap,
              gradient: "from-purple-500 to-blue-500"
            },
            {
              name: "Enterprise",
              price: "$99",
              period: "per month",
              description: "For teams and organizations",
              features: [
                "Everything in Pro Learner",
                "Advanced team management",
                "Bulk course creation tools",
                "Custom brand integration",
                "Full API access",
                "Dedicated success manager",
                "Custom integrations & support"
              ],
              popular: false,
              buttonText: "Contact Sales",
              buttonVariant: "outline",
              icon: Crown,
              gradient: "from-orange-500 to-rose-500"
            }
          ].map((plan, index) => (
            <div key={index} className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              plan.popular 
                ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:border-purple-800 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-blue-900/20 shadow-md scale-105' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-700'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-3">
                  <span className={`text-4xl font-bold ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' : 'text-slate-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">/{plan.period}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className={`w-4 h-4 ${plan.popular ? 'text-purple-600' : 'text-green-600'} flex-shrink-0`} />
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none' 
                    : plan.buttonVariant === 'outline' ? 'border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20' : ''
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
