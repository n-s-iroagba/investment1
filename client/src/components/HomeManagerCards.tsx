import { useGetList } from "@/hooks/useFetch";
import ManagerCard from "./ManagerCard";
import { Manager } from "@/types/manager";
import { apiRoutes } from "@/constants/apiRoutes";
import { Spinner } from "./Spinner";

const HomeManagerCards: React.FC = () => {
  const {data:managers,loading} = useGetList<Manager>(apiRoutes.manager.list());
  
  // Don't render anything if no managers
  if (!managers || managers.length === 0) {
    return null;
  }
  if (loading){
      <div className="flex items-center justify-center h-60">
          <Spinner className="w-6 h-6 text-green-600" />
        </div>
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-green-900">
          Our Investment Managers
        </h2>
        <div className="w-16 h-1 bg-green-500 rounded-full mt-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {managers.map((manager) => (
          <div key={manager.id}>
            <ManagerCard manager={manager}      
              
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeManagerCards;