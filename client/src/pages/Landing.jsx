import { Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Brain, Zap, ArrowRight, Play } from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-quantum-gradient p-2 rounded-lg">
              <Shield className="text-white" size={16} />
            </div>
            <span className="font-display font-bold text-2xl text-primary-600">QuantumChat</span>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link href="/chat">
                <Button variant="outline">Go to Chat</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900 mb-6">
                Quantum-Secure <span className="text-accent-main">Messaging</span> for the Future
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Experience unbreakable encryption with our real-time chat platform backed by quantum cryptography and advanced machine learning.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="shadow-lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="flex items-center btn-hover-effect">
                    <Shield size={16} className="mr-2" /> Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <Card className="p-4 quantum-glow">
                <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-quantum-gradient"></div>
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-success mr-2 animate-pulse"></div>
                    <span className="text-sm font-semibold">Quantum Encryption Active</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="chat-bubble-user bg-primary-600 text-white py-3 px-4 max-w-xs">
                        <p>Hi Alice! Let's discuss our research project using this quantum-secure chat.</p>
                        <span className="text-xs mt-1 opacity-70 flex items-center">
                          <Shield size={12} className="mr-1" /> End-to-end encrypted
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="chat-bubble-other bg-gray-200 py-3 px-4 max-w-xs">
                        <p>Perfect! I'm glad we have this secure channel for sensitive information.</p>
                        <span className="text-xs mt-1 opacity-70 flex items-center">
                          <Shield size={12} className="mr-1" /> End-to-end encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-white rounded border border-gray-200 flex items-center">
                    <input type="text" placeholder="Your message is encrypted with quantum technology" className="w-full bg-transparent border-none outline-none text-sm" readOnly />
                    <Button size="sm" variant="ghost" className="ml-2 rounded-full bg-primary-50 text-primary-600">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-center mb-12">Quantum-Level Security Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <Key size={20} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Quantum Key Distribution</h3>
              <p className="text-gray-600">Utilizing quantum principles to create unbreakable encryption keys that can't be intercepted.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 mb-4">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Key Refresh Mechanism</h3>
              <p className="text-gray-600">Automatic and manual key refresh options to ensure forward secrecy for all communications.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center text-accent-dark mb-4">
                <Brain size={20} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">ML Anomaly Detection</h3>
              <p className="text-gray-600">Machine learning algorithms that detect unusual patterns and potential security threats.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-quantum-light rounded-full flex items-center justify-center text-quantum-dark mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Real-time Encryption</h3>
              <p className="text-gray-600">Messages are encrypted and decrypted instantly with quantum-resistant algorithms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-6">Why Choose QuantumChat?</h2>
          <p className="text-lg text-gray-700 mb-12">
            In an era of increasing cyber threats, traditional encryption is no longer enough. 
            QuantumChat leverages the principles of quantum mechanics to provide security that's 
            theoretically impossible to breach.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <Shield size={18} className="text-primary-600" />
              </div>
              <span className="font-medium">Privacy First</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <span className="font-medium">Future-Proof Security</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-medium">Real-time Performance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-quantum-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl mb-6">Ready to Secure Your Communications?</h2>
          <p className="text-lg opacity-90 mb-10">
            Join thousands of security-conscious users who trust QuantumChat for their sensitive communications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/signup">
              <Button variant="secondary" size="lg">Create Free Account</Button>
            </Link>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <Shield size={16} className="text-primary-600" />
                </div>
                <span className="font-display font-bold text-xl">QuantumChat</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Next-generation secure messaging powered by quantum cryptography.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-display font-medium text-lg mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Security</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Enterprise</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-display font-medium text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Whitepaper</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-display font-medium text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2023 QuantumChat. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
