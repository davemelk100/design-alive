const LogoBanner = () => (
  <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-[rgb(223,223,223)]/60 dark:bg-gray-700 py-1.5 select-none">
    <div className="flex animate-scroll-banner items-center gap-[60px] w-max">
      {[...Array(2)].map((_, setIndex) => (
        <div
          key={setIndex}
          className="flex items-center gap-[60px] shrink-0"
        >
          <img src="/img/carousel/optum-carousel.svg" alt="Optum" className="h-6 w-auto object-contain" />
          <img src="/img/carousel/healthcare-dot-gov-carousel.svg" alt="Healthcare.gov" className="h-5 w-auto object-contain" />
          <img src="/img/carousel/customgpt-carousel.png" alt="CustomGPT.ai" className="h-7 w-auto object-contain" />
          <img src="/img/carousel/dcal-carousel.svg" alt="DCAL" className="h-7 w-auto object-contain" />
          <img src="/img/carousel/logo-ddpa-green.png" alt="Delta Dental" className="h-5 w-auto object-contain" />
          <img src="/img/carousel/bsbsm-carousel.png" alt="BCBSM" className="h-10 w-auto object-contain" />
          <img src="/img/carousel/meridian-carousel.png" alt="Meridian" className="h-9 w-auto object-contain" />
          <img src="/img/carousel/data-foundation-carousel.png" alt="Data Foundation" className="h-10 w-auto object-contain" />
          <img src="/img/carousel/nextier-carousel.png" alt="Nextier" className="h-9 w-auto object-contain" />
          <img src="/img/carousel/logo-propio.svg" alt="Propio" className="h-8 w-auto object-contain" />
          <img src="/img/carousel/dewpoint-carousel.svg" alt="Dewpoint" className="h-8 w-auto object-contain" />
          <img src="/img/carousel/neogen-carousel.png" alt="Neogen Corporation" className="h-8 w-auto object-contain" />
          <img src="/img/carousel/fictionforge-carousel.png" alt="FictionForge" className="h-7 w-auto object-contain" />
          <img src="/img/carousel/cygnet-carousel.svg" alt="Cygnet" className="h-10 w-auto object-contain" />
          <img src="/img/carousel/dark-slide-carousel.png" alt="Dark Slide" className="h-10 w-auto object-contain" />
          <img src="/img/carousel/knifehub-carousel.png" alt="KnifeHub" className="h-10 w-auto object-contain" />
          <img src="/img/carousel/som-carousel.png" alt="Mi.gov" className="h-9 w-auto object-contain" />
        </div>
      ))}
    </div>
  </div>
);

export default LogoBanner;
