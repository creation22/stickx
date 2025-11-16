"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import { useState } from "react";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";


export const Nav = () => {
  const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "Browse",
      link: "#browse",
    },
,
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full dark">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/creation22/StickX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="GitHub"
            >
              <IconBrandGithub className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://twitter.com/_creation22" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Twitter"
            >
              <IconBrandX className="w-5 h-5 text-white" />
            </a>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative"
                style={{ color: '#e5e5e5', fontFamily: "'Playfair Display', serif" }}>
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <a 
                href="https://github.com/creation22/StickX" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <IconBrandGithub className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com/_creation22" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <IconBrandX className="w-5 h-5" />
                <span>Twitter</span>
              </a>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      {/* Navbar */}
    </div>
  );
}
