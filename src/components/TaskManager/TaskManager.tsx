import React, { useContext, useEffect, useState } from "react";
import styles from "./TaskManager.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Each } from "../../utils/EachLoop";
import Task from "../../common/components/Task/Task";
import Modal from "../../common/components/Modal/Modal";
import { addTask, priorities, statuses } from "../../utils/api";
import Toast from "../../common/components/Toast/Toast";
import { DeveloperDataContext } from "../../utils/appContext";

interface TaskManagerProps {
  data: any;
  handleTaskSelected: any;
  selectedTask: any;
  iconMap?: any;
}

const TaskManager: React.FC<TaskManagerProps> = (props) => {
  const {
    conatinerStyle,
    headerStyle,
    contentStyle,
    modalContainer,
    customStyle,
    taskNameStyle,
    errorStyle,
    statusStyle,
    taskDescriptionStyle,
    startDateStyle,
    endDateStyle,
    prioritiesStyle,
    statusesStyle,
    submitButtonStyle,
  } = styles;
  const [show, setShow] = useState<any>(false);
  const [taskName, setTaskName] = useState("");
  const [taskNameError, setTaskNameError] = useState("");
  const [statusArray, setStatusArray] = useState<any>([]);
  const [priorityArray, setPriorityArray] = useState<any>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDescriptionError, setTaskDescriptionError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [prioritySelected, setPrioritySelected] = useState("low");
  const [statusSelected, setStatusSelected] = useState("pending");
  const { appData, setAppData } = useContext(DeveloperDataContext);

  const getPriority = () => {
    priorities()
      .then((res) => {
        setPriorityArray(res);
      })
      .catch((err) => {
        setPriorityArray([]);
      });
  };

  const getStatus = () => {
    statuses()
      .then((res) => {
        setStatusArray(res);
      })
      .catch((err) => {
        setStatusArray([]);
      });
  };

  useEffect(() => {
    getPriority();
    getStatus();
  }, []);

  const clearAll = () => {
    setTaskName("");
    setTaskDescription("");
    setStartDate("");
    setEndDate("");
    setPrioritySelected("");
    setStatusSelected("");
  };

  const renderStatus = (item: any, index: any) => (
    <option className={statusStyle} key={index}>
      {item?.name}
    </option>
  );

  const handleTaskName = (e: any) => {
    setTaskName(e?.target?.value);
    setTaskNameError(
      e?.target?.value?.length == 0 ? "Task name is required" : "",
    );
  };

  const handleTaskDescription = (e: any) => {
    setTaskDescription(e?.target?.value);
    setTaskDescriptionError(
      e?.target?.value?.length == 0 ? "Task Description is required" : "",
    );
  };

  const handleStartDate = (e: any) => {
    setStartDate(e?.target?.value);
    setStartDateError(
      e?.target?.value?.length == 0 ? "Start Date is Required" : "",
    );
  };

  const handleEndDate = (e: any) => {
    setEndDate(e?.target?.value);
    setEndDateError(
      e?.target?.value?.length == 0 ? "End Date is Required" : "",
    );
  };

  const handleAddTask = () => {
    setShow(!show);
    clearAll();
  };

  const handleCreateTask = () => {
    let body = {
      name: taskName,
      description: taskDescription,
      startDate: startDate,
      endDate: endDate,
      priority: prioritySelected?.length == 0 ? "low" : prioritySelected,
      status: statusSelected?.length == 0 ? "pending" : statusSelected,
    };

    addTask(body)
      .then((res) => {
        Toast("success", res?.message, "3000", "top-right");
        setAppData({ updateTask: true });
      })
      .catch((err) => {
        Toast("error", err?.message, "3000", "top-right");
      });
  };

  return (
    <>
      <div className={conatinerStyle}>
        <div className={headerStyle}>
          <p>My Tasks</p>
          <FontAwesomeIcon icon={faAdd} onClick={handleAddTask} />
        </div>
        <div className={contentStyle}>
          <Each
            handleClick={props?.handleTaskSelected}
            data={props?.data}
            selectedFolder={props?.selectedTask}
            iconMap={props?.iconMap}
          >
            {Task}
          </Each>
        </div>
      </div>
      <Modal isOpen={show} setIsOpen={setShow} customStyle={customStyle}>
        <div className={modalContainer}>
          <div className={taskNameStyle}>
            <label htmlFor="taskname">Task Name</label>
            <input
              id="taskname"
              name="taskname"
              type="text"
              placeholder="Task 1"
              onChange={handleTaskName}
              value={taskName}
            />
            {taskNameError && <div className={errorStyle}>{taskNameError}</div>}
          </div>
          <div className={taskDescriptionStyle}>
            <label htmlFor="taskDescription">Task Description</label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              placeholder="Task 1 Description"
              onChange={handleTaskDescription}
              value={taskDescription}
            />
            {taskDescriptionError && (
              <div className={errorStyle}>{taskDescriptionError}</div>
            )}
          </div>
          <div className={startDateStyle}>
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              placeholder="DD/MM/YYYY"
              onChange={handleStartDate}
              value={startDate}
            />
            {startDateError && (
              <div className={errorStyle}>{startDateError}</div>
            )}
          </div>
          <div className={endDateStyle}>
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              placeholder="DD/MM/YYYY"
              onChange={handleEndDate}
              value={endDate}
            />
            {endDateError && <div className={errorStyle}>{endDateError}</div>}
          </div>
          <div className={prioritiesStyle}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={prioritySelected}
              onChange={(e) => setPrioritySelected(e?.target?.value)}
            >
              <Each data={priorityArray}>{renderStatus}</Each>
            </select>
          </div>
          <div className={statusesStyle}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={statusSelected}
              onChange={(e) => setStatusSelected(e?.target?.value)}
            >
              <Each data={statusArray}>{renderStatus}</Each>
            </select>
          </div>
          <button
            type="submit"
            onClick={() => handleCreateTask()}
            className={submitButtonStyle}
            disabled={
              taskName?.length == 0 ||
              taskNameError ||
              taskDescription?.length == 0 ||
              taskDescriptionError ||
              startDate?.length == 0 ||
              startDateError ||
              endDate?.length == 0 ||
              endDateError
                ? true
                : false
            }
          >
            Add Task
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TaskManager;
