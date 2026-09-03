export default function BrandLogo({ testId = 'brand-auralens' }: { testId?: string }) {
  return (
    <div className="flex items-center gap-3.5" data-testid={testId}>
      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#f5c65d] text-[#202840] shadow-[0_4px_0_#d39d36]">
        <div className="h-4 w-4 rounded-full border-[2.5px] border-[#202840]" />
        <div className="absolute h-7 w-7 rounded-full border border-[#202840]/30 animate-pulse" />
      </div>
      <div>
        <h1 className="font-serif text-[22px] font-bold leading-none tracking-[-0.04em] text-[#202840]">
          AuraLens
        </h1>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#718195]">
          A softer way to study
        </p>
      </div>
    </div>
  );
}
