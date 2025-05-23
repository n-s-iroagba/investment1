'use client';


import ManagerCard from "@/components/ManagerCard";
import { apiRoutes } from "@/constants/apiRoutes";
import { useGetList } from "@/hooks/useFetch";
import { Manager } from "@/types/manager";

const ManagerList = () => {
  const { data, error, loading } = useGetList<Manager>(apiRoutes.manager.list());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching managers</div>;
  if (!data) return null;
  console.log(data[1].image)
  return (
    <>
    <ManagerCard manager ={data[1]}/>
      {/* {data.map((manager) => (
        <div key={manager.id}>
          <ManagerCard manager={manager} />
          <div className="t">FirstName: {manager.firstName}</div>
        </div>
      ))} */}
    </>
  );
};

export default ManagerList;
