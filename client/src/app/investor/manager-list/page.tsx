'use client';


import InvestorOffCanvas from "@/components/InvestorOffCanvas";
import ManagerCard from "@/components/ManagerCard";
import { apiRoutes } from "@/constants/apiRoutes";
import { useGetList } from "@/hooks/useFetch";
import { Manager } from "@/types/manager";

const ManagerList = () => {
  const { data, error, loading } = useGetList<Manager>(apiRoutes.manager.list());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching managers</div>;

  return (
    <InvestorOffCanvas>

      {data.map((manager) => (
        <div key={manager.id}>
          <ManagerCard manager={manager} />
       
        </div>
      ))}
    </InvestorOffCanvas>
  );
};

export default ManagerList;
