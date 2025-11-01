import { Github, Twitter, Linkedin, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <h3 className="text-xl font-bold">Kiranfolio</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your source for the latest technology news and innovations from leading tech companies worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="/?category=google" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-google"
                >
                  Google
                </a>
              </li>
              <li>
                <a 
                  href="/?category=apple" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-apple"
                >
                  Apple
                </a>
              </li>
              <li>
                <a 
                  href="/?category=microsoft" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-microsoft"
                >
                  Microsoft
                </a>
              </li>
              <li>
                <a 
                  href="/?category=openai" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-openai"
                >
                  OpenAI
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://kiranfolio.netlify.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-footer-portfolio"
                >
                  Portfolio <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-about"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="Twitter" data-testid="link-footer-twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="GitHub" data-testid="link-footer-github">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="LinkedIn" data-testid="link-footer-linkedin">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
              &copy; {currentYear} Kiranfolio. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built by</span>
              <a 
                href="https://kiranfolio.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Kiran Kumar G
                <Globe className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
