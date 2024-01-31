import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./CurrentTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Each } from "../../utils/EachLoop";
import {
  editTaskDetails,
  priorities,
  statuses,
  taskDelete,
} from "../../utils/api";
import Toast from "../../common/components/Toast/Toast";
import { DeveloperDataContext } from "../../utils/appContext";
import moment from "moment";

interface CurrentTaskProps {
  data: any;
  handleEdited?: any;
  iconMap?: any;
}

const CurrentTask: React.FC<CurrentTaskProps> = (props) => {
  const {
    containerStyle,
    leftStyle,
    rightStyle,
    headerStyle,
    contentStyle,
    descriptionStyle,
    bottomConatainer,
    dataPickerStyle,
    priorityPickerStyle,
    dropDownContainer,
    statusStyle,
    startDate,
    endDate,
    editStyle,
  } = styles;
  const [editedValues, setEditedValues] = useState<any>(false);
  const { appData, setAppData } = useContext(DeveloperDataContext);
  const [statusArray, setStatusArray] = useState<any>([]);
  const [priorityArray, setPriorityArray] = useState<any>([]);
  const [taskName, setTaskName] = useState(props?.data?.name);
  const [taskDescription, setTaskDescription] = useState(
    props?.data?.description,
  );
  const [startDateFormatted, setStartDateFormatted] = useState(
    props?.data?.startDateFormatted,
  );
  const [endDateFormatted, setEndDateFormatted] = useState(
    props?.data?.endDateFormatted,
  );
  const [prioritySelected, setPrioritySelected] = useState(
    props?.data?.priority,
  );
  const [statusSelected, setStatusSelected] = useState(props?.data?.status);

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

  const renderStatus = (item: any, index: any) => (
    <option className={statusStyle} key={index}>
      {item?.name}
    </option>
  );

  const deleteTask = (id: any) => {
    taskDelete(id)
      .then((res) => {
        Toast("success", res?.message, "3000", "top-right");
        setAppData({ updateTask: true });
      })
      .catch((err) => {
        Toast("error", err?.message, "3000", "top-right");
      });
  };

  const editTask = useCallback(async () => {
    let body = {
      name: taskName,
      description: taskDescription,
      status: statusSelected,
      priority: prioritySelected,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };
    await editTaskDetails(props?.data?._id, body)
      .then((res) => {
        Toast("success", res?.message, "3000", "top-right");
        setAppData({ updateTask: true });
      })
      .catch((err) => {
        Toast("error", err?.message, "3000", "top-right");
      });
  }, [
    taskName,
    taskDescription,
    startDateFormatted,
    endDateFormatted,
    prioritySelected,
    statusSelected,
  ]);

  return (
    <div className={containerStyle}>
      <div className={headerStyle}>
        <div className={leftStyle}>
          {editedValues ? (
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e?.target?.value)}
              style={{
                width: `${(taskName?.length + 1) * 8}px`,
              }}
            />
          ) : (
            <p>{props?.data?.name}</p>
          )}
          <div className={dropDownContainer}>
            {editedValues ? (
              <select
                onChange={(e) => setStatusSelected(e.target.value)}
                value={statusSelected}
              >
                <Each data={statusArray}>{renderStatus}</Each>
              </select>
            ) : (
              <FontAwesomeIcon
                icon={props?.iconMap[props?.data?.status]}
                data-type={props?.data?.status}
                onClick={() => setStatusSelected(props?.data?.status)}
              />
            )}
          </div>
        </div>
        {!editedValues ? (
          <FontAwesomeIcon
            className={editStyle}
            icon={faEdit}
            onClick={() => setEditedValues(true)}
          />
        ) : (
          <FontAwesomeIcon
            className={editStyle}
            icon={faCloudArrowUp}
            onClick={editTask}
          />
        )}
        <FontAwesomeIcon
          className={rightStyle}
          icon={faTrash}
          onClick={() => deleteTask(props?.data?._id)}
        />
      </div>
      <div className={contentStyle}>
        <div className={descriptionStyle}>
          {editedValues ? (
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={10}
            />
          ) : (
            <p>{props?.data?.description}</p>
          )}
        </div>
        <div className={bottomConatainer}>
          <div className={dataPickerStyle}>
            <div className={startDate}>
              {editedValues ? (
                <input
                  type="date"
                  value={moment(startDateFormatted)
                    .format("YYYY-MM-DD")
                    .toString()}
                  onChange={(e) => setStartDateFormatted(e.target.value)}
                />
              ) : (
                <p>
                  {moment(props?.data?.startDateFormatted).format("DD-MM-YYYY")}
                </p>
              )}
            </div>
            <div className={endDate}>
              {editedValues ? (
                <input
                  type="date"
                  value={moment(endDateFormatted).format("YYYY-MM-DD")}
                  onChange={(e) => setEndDateFormatted(e.target.value)}
                />
              ) : (
                <p>
                  {moment(props?.data?.endDateFormatted).format("DD-MM-YYYY")}
                </p>
              )}
            </div>
          </div>
          <div className={priorityPickerStyle}>
            {editedValues ? (
              <select
                onChange={(e) => setPrioritySelected(e.target.value)}
                value={prioritySelected}
              >
                <Each data={priorityArray}>{renderStatus}</Each>
              </select>
            ) : (
              <p>{props?.data?.priority}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTask;
