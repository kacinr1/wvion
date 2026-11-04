'use client';

import { ConfiguratorProvider } from './ConfiguratorProvider';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Strip } from './Strip';
import { Marquee } from './Marquee';
import { Formules } from './Formules';
import { Services } from './Services';
import { AllInSection } from './AllInSection';
import { Fleet } from './Fleet';
import { Drivers } from './Drivers';
import { Teaser } from './Teaser';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { Configurator } from './Configurator';
import { Reveal } from './Reveal';

export function Home() {
  return (
    <ConfiguratorProvider>
      <div className="wv-root" style={{ width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
        <Nav />
        <Hero />
        <Reveal><Strip /></Reveal>
        <Reveal><Marquee /></Reveal>
        <Reveal><Formules /></Reveal>
        <Reveal><Services /></Reveal>
        <Reveal><AllInSection /></Reveal>
        <Reveal><Fleet /></Reveal>
        <Reveal><Drivers /></Reveal>
        <Reveal><Teaser /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><Footer /></Reveal>
        <Configurator />
      </div>
    </ConfiguratorProvider>
  );
}
