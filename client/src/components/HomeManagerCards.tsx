import { useGetList } from "@/hooks/useFetch";
import ManagerCard from "./ManagerCard";
import { Manager } from "@/types/manager";
import { apiRoutes } from "@/constants/apiRoutes";
import { Spinner } from "./Spinner";

const HomeManagerCards: React.FC = () => {
  const { data: managers, loading } = useGetList<Manager>(apiRoutes.manager.list());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Spinner className="w-6 h-6 text-blue-600" />
      </div>
    );
  }
  
  if (!managers || managers.length === 0) {
    return null;
  }

  return (
<div className="py-12 px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
  <div className="flex flex-col items-center mb-12">
    <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 px-2">
      Our Investment Managers
    </h2>
    <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
  </div>
  
  <div className="grid gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-12 grid-cols-6">
    {managers.map((manager) => (
      <ManagerCard key={manager.id} manager={manager} />
    ))}
  </div>
</div>

  );
};

export default HomeManagerCards;