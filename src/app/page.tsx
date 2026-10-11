import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Statement } from "@/components/sections/Statement";
import { Testimonials } from "@/components/sections/Testimonials";
import { Treatments } from "@/components/sections/Treatments";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Treatments />
      <Statement />
      <Gallery />
      <CtaBand />
      <Journey />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
