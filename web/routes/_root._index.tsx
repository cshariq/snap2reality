import { useOutletContext, Link } from "@remix-run/react";
import { ArrowRight, Lightbulb, Recycle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500 to-blue-500 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Transform Waste into Wonder
            </h1>
            <p className="text-xl text-white/90">
              Your spare items turned into innovative projects! Join our community of creative recyclers.
            </p>
            <div className="space-x-4 pt-4">
              <Button size="lg" variant="default" className="bg-white text-emerald-600 hover:scale-105 transition" asChild>
                <Link to="/sign-up">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:scale-105 transition" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src="/camera.png" alt="Recycled Camera Project" className="rounded-lg shadow-2xl motion-safe:animate-fade-up" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 text-white">Why Choose Scrap2Reality</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of innovators turning everyday waste into extraordinary creations
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Recycle className="h-8 w-8 text-emerald-500" />, title: "Sustainable Impact", desc: "Reduce waste while creating something new" },
            { icon: <Lightbulb className="h-8 w-8 text-emerald-500" />, title: "Creative Freedom", desc: "Transform items into unique projects" },
            { icon: <Users className="h-8 w-8 text-emerald-500" />, title: "Community", desc: "Connect with fellow innovators" }
          ].map((feature, i) => (
            <Card key={i} className="hover:scale-105 transition duration-300">
              <CardContent className="p-6 space-y-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { number: "01", title: "Upload Items", desc: "Share your spare items with our community" },
            { number: "02", title: "Get Creative", desc: "Browse project ideas or create your own" },
            { number: "03", title: "Transform", desc: "Turn waste into functional art" }
          ].map((step, i) => (
            <div key={i} className="relative motion-safe:animate-fade-up" style={{ animationDelay: `${i * 200}ms` }}>
              <div className="text-5xl font-bold text-emerald-500/20 absolute -top-8 -left-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <Card className="bg-slate-50">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "****", label: "Active Projects" },
              { number: "****+", label: "Items Recycled" },
              { number: "****+", label: "Community Members" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl font-bold text-emerald-600">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
