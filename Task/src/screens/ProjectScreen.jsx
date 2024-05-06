import { useEffect, useState } from "react";
import ProjectSummaryCards from "../components/ProjectSummary/ProjectSummaryCards";
import { AiFillAppstore } from "react-icons/ai";
import { getProjectApi } from "../utils/projects";
import { formattedDate } from "../utils/formatDate";
import { jwtDecode } from "jwt-decode"
import Loader from "../components/Loader/Loader";

const ProjectScreen = () => {
    const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
    console.log("userloggrgin",user)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [open,setOpen] =useState(false)
    const getProject = async () => {
        setLoading(true)
        const project = await getProjectApi()
        console.log("project",project)
        if (project.status === 200) {
            const filteredProject = project?.data.all_project.filter((user_project,i)=>
            user_project.shared_with.some(item =>item ===user.user_id))
            console.log("filtereddATA---->",filteredProject)
             setData(filteredProject)
            setLoading(false)
        } else {
            alert("Error Occurred")
        }
    }
    const handleClick = ()=>{
        setOpen(!open)
    }
    useEffect(() => {
        getProject()
    }, [])
   
    return (
        <div className="mt-10 relative">
            <div className="flex justify-between">
                <h2 className="ml-5">Project Summary</h2>
                
            </div>
            <div className="flex flex-wrap w-full gap-2 ml-5 mt-4">
                {
                    data?.map((item, i) => {
                        return <ProjectSummaryCards
                            title={item.title}
                            key={i}
                            id={item.id}
                            created_at={formattedDate(item.created_at)}
                            description={item.description}
                            due_date={item.due_date}
                            progress={item.progress_status}
                        />
                    })
                }
                {
                    loading && <div className="justify-center items-center w-full h-full opacity z-20 "><Loader/></div>
                }
                
                    {!loading && data?.length === 0 && <h2>No project available yet</h2>}
                
            </div>
           
        </div>
    );
}

export default ProjectScreen;
