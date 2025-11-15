import React from 'react'

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/20 bg-black/40 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 justify-between">

                    {/* Left Section */}
                    <div className="text-center lg:text-left">
                        <div className="text-lg sm:text-xl font-semibold" style={{ color: '#ffffff', fontFamily: "'Inter Tight', sans-serif" }}>
                            StickX
                        </div>
                        <div className="text-xs sm:text-sm" style={{ color: '#e5e5e5' }}>
                            Built by Srajan Gupta • All rights reserved
                        </div>
                    </div>

                    {/* Middle Links */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: '#e5e5e5' }}>
                        <a
                            href="mailto:creation2224@gmail.com"
                            className="transition-colors min-h-[44px] flex items-center"
                            style={{ color: '#e5e5e5' }}
                            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        >
                            Email
                        </a>
                        <span className="text-white/30">•</span>

                        <a
                            href="https://github.com/creation22"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors min-h-[44px] flex items-center"
                            style={{ color: '#e5e5e5' }}
                            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        >
                            GitHub
                        </a>
                        <span className="text-white/30">•</span>

                        <a
                            href="https://www.linkedin.com/in/ssrajangupta22/"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors min-h-[44px] flex items-center"
                            style={{ color: '#e5e5e5' }}
                            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        >
                            LinkedIn
                        </a>
                        <span className="text-white/30">•</span>

                        <a
                            href="https://twitter.com/_creation22"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors min-h-[44px] flex items-center"
                            style={{ color: '#e5e5e5' }}
                            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        >
                            Twitter
                        </a>
                    </div>

                    {/* Buy Me a Coffee */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://buymeacoffee.com/creation22"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-white/20 transition-colors min-h-[44px]"
                            style={{ color: '#ffffff' }}
                        >
                            <span>☕ Buy me a coffee</span>
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer
