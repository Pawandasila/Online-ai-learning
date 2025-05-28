"use client";
import Link from "next/link";
import { 
  Brain,
  Globe,
  Users,
  Shield
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">SkillSprint</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered personalized learning platform helping students transform their careers through intelligent course creation.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Globe, label: "Website", gradient: "from-purple-500 to-purple-600" },
                { icon: Users, label: "Community", gradient: "from-blue-500 to-blue-600" }, 
                { icon: Shield, label: "Security", gradient: "from-rose-500 to-rose-600" }
              ].map((social, index) => (
                <div key={index} className={`w-8 h-8 bg-gradient-to-r ${social.gradient} hover:scale-110 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer group`}>
                  <social.icon className="w-4 h-4 text-white group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Product</h3>
            <ul className="space-y-2">
              {[
                "AI Course Generation",
                "Learning Analytics",
                "Community Features", 
                "Certificates",
                "Mobile App",
                "API Access"
              ].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">Company</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Careers",
                "Press",
                "Blog",
                "Contact",
                "Partners"
              ].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Documentation",
                "System Status",
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy"
              ].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-slate-400 hover:text-rose-400 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-slate-400 text-sm">
            © 2024 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">SkillSprint</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-slate-400 text-sm">
            <span>Built with <span className="text-red-400">❤️</span> using Next.js & AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
