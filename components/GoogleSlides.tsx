import TaetaeLegalComplianceUI from "./legalPage";

export default function GoogleSlides() {
  return (
    <section className="w-full mx-auto my-8 px-4">
      {/* Container to maintain 16:9 aspect ratio */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg pt-[56.25%] bg-gray-100">
        {/* <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vQOt7GjRQPLDR3vcXQjM2zC24WPBGJpfzlVCFwI1O5x48pNb-OANELd5hWlubaIIkGbabRahah5hRCL/embed?start=true&loop=true&delayms=4000"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title="The TaeTae Foundation Profile 2026"
        /> */}
        <iframe
          src="/The TaeTae Foundation Profile 2026..pdf#toolbar=0&navpanes=0&scrollbar=0"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title="The TaeTae Foundation Profile 2026"
        />
      </div>
    </section>
  );
}

