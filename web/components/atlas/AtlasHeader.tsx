interface AtlasHeaderProps {
  title: string;
  description: string;
}

export default function AtlasHeader({
  title,
  description,
}: AtlasHeaderProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
}