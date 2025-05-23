
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A página que você está procurando não existe.
        </p>
        <Button onClick={() => navigate("/")}>
          Voltar ao Painel
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
