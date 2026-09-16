import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-bold text-foreground/5 leading-none select-none mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            size="lg"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={<Home size={15} />}
            onClick={() => navigate("/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
