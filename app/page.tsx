import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { ExperienceSection } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { StealthStartup } from "@/components/sections/StealthStartup";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StealthStartup />
        <Projects />
        <Skills />
        <ExperienceSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
