import React, { useContext, useEffect, useState } from "react";
import styles from "./css/Home.module.css";
import CommonCard from "../common/components/CommonCard/CommonCard";
import CommonChart from "../common/components/CommonCharts/CommonChart";
import ListTasks from "../common/components/ListTasks/ListTasks";
import { Each } from "../utils/EachLoop";
import TaskManager from "../components/TaskManager/TaskManager";
import {
  faExclamationCircle,
  faCheckCircle,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import CurrentTask from "../components/CurrentTask/CurrentTask";
import GlobalFilter from "../common/components/GlobalFilter/GlobalFilter";
import { getTask, getTaskCount } from "../utils/api";
import { DeveloperDataContext } from "../utils/appContext";
import { getUserDetailsInfo } from "../utils/userDetailsInfo";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { conatinerStyle, wrapperStyle, currentWrapper, filterWrapper } =
    styles;
  const [selectedTask, setSelectedTask] = useState<any>([]);
  const { appData, setAppData } = useContext(DeveloperDataContext);
  const [selectedFilter, setSelectedFilter] = useState<any>({
    filter: {
      name: "Priority Tasks",
      value: 4,
    },
    order: 0,
  });
  const [data, setData] = useState<any>([]);
  const [tasks, setTasks] = useState([]);
  const iconMap = {
    pending: faExclamationCircle,
    "in-progress": faCircle,
    completed: faCheckCircle,
  };

  const taskCount = () => {
    getTaskCount()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setData([]);
      });
  };

  const getAllTask = (filter: any) => {
    getTask(filter)
      .then((res) => {
        setTasks(res);
      })
      .catch((err) => {
        setTasks([]);
      });
  };

  useEffect(() => {
    getAllTask(selectedFilter);
    taskCount();
  }, [selectedFilter, appData?.updateTask]);

  const filters: any = [
    {
      name: "due",
      value: 1,
    },
    {
      name: "today",
      value: 2,
    },
    {
      name: "tommorrow",
      value: 3,
    },
    {
      name: "priority",
      value: 4,
    },
    {
      name: "creation-date",
      value: 5,
    },
  ];
  const handleTaskSelected = (each: any) => {
    setSelectedTask(each);
  };

  const handleTaskEdit = (each: any) => {};

  const handleFilterSelected = (each: any) => {
    setSelectedFilter(each);
  };

  return (
    <div className={wrapperStyle}>
      <CommonCard cardWrapper={filterWrapper}>
        <GlobalFilter
          selectedFilter={selectedFilter}
          data={filters}
          handleCLick={handleFilterSelected}
        />
      </CommonCard>
      <div className={conatinerStyle}>
        <Each data={data}>{ListTasks}</Each>
        <CommonCard>
          <CommonChart data={data} />
        </CommonCard>
        <CommonCard>
          <TaskManager
            data={tasks}
            handleTaskSelected={handleTaskSelected}
            selectedTask={selectedTask}
            iconMap={iconMap}
          />
        </CommonCard>
        {selectedTask?.length == 0 ? null : (
          <CommonCard cardWrapper={currentWrapper}>
            <CurrentTask
              key={selectedTask?._id}
              data={selectedTask}
              handleEdited={handleTaskEdit}
              iconMap={iconMap}
            />
          </CommonCard>
        )}
      </div>
    </div>
  );
};

export default Home;
