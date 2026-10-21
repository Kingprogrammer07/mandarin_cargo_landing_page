import { site } from "@/config/site";
import Calculator from "@/components/sections/Calculator";
import TrackOrder from "@/components/sections/TrackOrder";
import Spotlight from "@/components/ui/Spotlight";

/** The two things a visitor comes to do: price a parcel and find one. */
export default function Tools({ price }: { price?: string | null }) {
  const pricePerKg = Number((price ?? "").replace("$", "")) || site.pricePerKg;

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-32">
      <Spotlight className="mx-auto grid max-w-[1200px] gap-4 lg:grid-cols-2 lg:gap-5">
        <article id="calculator" data-spot aria-labelledby="calc-title" className="r card scroll-mt-24" style={{ "--i": 0 } as React.CSSProperties}>
          <Calculator pricePerKg={pricePerKg} />
        </article>
        <article id="track" data-spot aria-labelledby="track-title" className="r card scroll-mt-24" style={{ "--i": 1 } as React.CSSProperties}>
          <TrackOrder />
        </article>
      </Spotlight>
    </section>
  );
}
