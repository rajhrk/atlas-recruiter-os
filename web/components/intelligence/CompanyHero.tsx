interface Props {
  name: string;
  companyType: string;
  headquarters: string;
}

export default function CompanyHero({
  name,
  companyType,
  headquarters,
}: Props) {
  return (
    <section className="rounded-xl border bg-white p-8">
      <div className="text-sm font-medium text-blue-600">
        {companyType}
      </div>

      <h1 className="mt-2 text-4xl font-bold">
        {name}
      </h1>

      <p className="mt-3 text-slate-600">
        {headquarters}
      </p>
    </section>
  );
}