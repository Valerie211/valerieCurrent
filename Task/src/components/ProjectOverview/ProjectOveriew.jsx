import { useEffect, useState } from "react";
import LineChart from "../Charts/LineChart";
import getMonthName from "../../utils/getMonth";

const ProjectOverview = ({ projectData, loading }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
      console.log("projectData",projectData)
        if (projectData) {
            setBarChartData(projectData.monthly_completed_projects);
        }
    }, [projectData]);

    const formattedData = barChartData?.map((item) => ({
        month: getMonthName(item.month),
        count: parseInt(item.count)
    }));

    const data = {
        labels: formattedData?.map(item => item.month),
        datasets: [
            {
                label: "Monthly Completed Projects",
                data: formattedData?.map(item => item.count),
                backgroundColor: ["#ad5cf7"],
                borderColor: ["rgb(201, 203, 207)"],
                borderWidth: 1,
                barThickness: 40,
            },
        ],
    };

    return (
        <div className='w-2/3 bg-white h-[400px] p-4'>
            <div className="flex justify-between">
                <h2 className="text-sm">Project Overview</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-100 text-[#ad5cf7] py-1 w-20 text-sm rounded-md ">month</button>
                </div>
            </div>
            {
                barChartData && barChartData.length > 0
                    ? <LineChart data={data} />
                    : loading ? <p>Loading...</p>
                    : <div className="text-center py-8">No project completed for this month</div>
            }
        </div>
    );
}

export default ProjectOverview;
