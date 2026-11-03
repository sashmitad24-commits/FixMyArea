import { Link } from 'react-router-dom';

const features = [
  {
    number: '01',
    title: 'Tell us what needs fixing',
    description: 'Share the issue, where it is, and how urgent it feels. Every useful detail helps.',
    icon: '⌖',
  },
  {
    number: '02',
    title: 'Your community takes action',
    description: 'Reports are gathered in one place so local teams can see what needs attention.',
    icon: '↗',
  },
  {
    number: '03',
    title: 'Follow the progress',
    description: 'Check the latest status and see your report move toward a better neighbourhood.',
    icon: '✓',
  },
];

function Home() {
  return (
    <div className="space-y-20 pb-8">
      <section className="relative isolate flex min-h-[min(82svh,820px)] w-full items-center overflow-hidden bg-slate-950 px-6 py-20 sm:px-10 lg:px-16">
        <img
          src="/neighborhood-hero.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20" />

        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <img src="/fix-my-area-logo.svg" alt="" className="size-12 drop-shadow-lg sm:size-14" />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-400" />
              A better place starts with us
            </div>
          </div>
          <h1 className="m-0 text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Small reports.
            <span className="block text-sky-300">Big change.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
            Spot something that needs attention? Bring your neighbourhood together,
            report local issues, and follow every step toward a fix.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-white to-sky-100 px-5 py-3.5 font-bold text-slate-950 shadow-lg shadow-sky-950/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              to="/add-complaint"
            >
              Report an issue <span aria-hidden="true">→</span>
            </Link>
            <Link
              className="inline-flex items-center rounded-xl border border-white/35 bg-white/10 px-5 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
              to="/complaints"
            >
              Explore community reports
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> Report in minutes</span>
            <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> Track progress</span>
            <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> Community-powered</span>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden max-w-xs rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white shadow-2xl backdrop-blur-md xl:block">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-400/15 text-xl text-emerald-300">⌖</div>
            <div>
              <p className="m-0 text-sm font-bold">Your voice matters here</p>
              <p className="m-0 mt-1 text-xs text-slate-300">One report can start a neighbourhood-wide improvement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">Simple by design</span>
          <h2 className="mb-0 mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">From noticing to neighbourhood change.</h2>
          <p className="mb-0 mt-3 leading-7 text-slate-600 dark:text-slate-400">A clear, practical way to bring local problems to light and keep an eye on progress.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.number} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">{feature.icon}</span>
                <span className="text-sm font-bold tracking-widest text-slate-300 dark:text-slate-600">{feature.number}</span>
              </div>
              <h3 className="mb-2 mt-6 text-lg font-bold text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="m-0 leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 px-6 py-10 text-white shadow-xl shadow-blue-950/10 sm:mx-6 sm:px-10 sm:py-12 lg:mx-8 lg:px-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <img src="/fix-my-area-logo.svg" alt="" className="hidden size-14 shrink-0 sm:block" />
            <div>
              <h2 className="m-0 text-2xl font-extrabold tracking-tight sm:text-3xl">See an issue? Let’s get it moving.</h2>
              <p className="mb-0 mt-2 text-blue-100">Your next small action can make a visible difference.</p>
            </div>
          </div>
          <Link className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50" to="/add-complaint">
            Get started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
