import About from "./_components/about";
import CarouselPartners from "./_components/carousel-partners";
import Cta from "./_components/cta";
import Faq from "./_components/faq";
import Features from "./_components/features";
import Footer from "./_components/footer";
import Header from "./_components/header";
import Support from "./_components/support";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <About />
      <CarouselPartners />
      <Features />
      <Support />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
