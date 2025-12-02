import { useParams } from "react-router-dom";

export function ProjectDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Project Detail: {id}</h1>
    </div>
  );
}

