import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../app/router/utils/paths";
import GoBack from "../../../../shared/components/icons/GoBack";

interface Props {
  name: string;
  pokemonId: number;
}

const Header = ({ name, pokemonId }: Props) => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    const prevPath = localStorage.getItem("prevPath");
    if (prevPath) {
      navigate(prevPath, { replace: true });
      return;
    }
    navigate(PATHS.HOME, { replace: true });
  }, [navigate]);

  return (
    <header className="h-fit px-6 pt-6 text-white w-full flex items-center justify-between z-20">
      <div className="flex gap-4 items-center">
        <button
          type="button"
          className="cursor-pointer hover:shadow-lg transition-shadow rounded-full"
          onClick={handleGoBack}
        >
          <GoBack />
        </button>
        <h1 className="text-3xl md:text-5xl font-bold capitalize">{name}</h1>
      </div>
      <p className="text-base md:text-lg font-semibold">
        #{pokemonId.toString().padStart(3, "0")}
      </p>
    </header>
  );
};

export default Header;
