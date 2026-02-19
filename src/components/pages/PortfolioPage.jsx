import PortfolioSection from "../PortfolioSection";

const PortfolioPage = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen">

            {/* Hero Section — full-screen parallax background */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

                {/* Fixed parallax background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80)`,
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center top',
                    }}
                />

                {/* Dark overlay — fades to solid black at bottom so PortfolioSection blends in */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black" />

                {/* Hero Text */}
                <div className="relative z-10 text-center px-6 -translate-y-12">
                    <p className="text-white/50 tracking-[0.5em] text-xs uppercase mb-6">
                        Captured Moments
                    </p>
                    <h1 className="text-7xl md:text-8xl font-bold text-white tracking-wide mb-6 leading-tight">
                        OUR{' '}
                        <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">
                            PORTFOLIO
                        </span>
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C89968] to-transparent mx-auto mb-6" />
                    <p className="text-white/60 tracking-[0.4em] text-sm uppercase">
                        Images That Tell A Story
                    </p>
                </div>

                {/* Scroll-down indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
                    <div className="w-px h-14 bg-gradient-to-b from-white/0 to-white/40" />
                    <div className="w-4 h-4 border-r-2 border-b-2 border-white/40 rotate-45" />
                </div>
            </section>

            {/* Portfolio Section — z-10 so it scrolls over the fixed bg */}
            <div className="relative z-10 bg-[#0a0a0a]">
                <PortfolioSection />
            </div>

        </div>
    );
};

export default PortfolioPage;