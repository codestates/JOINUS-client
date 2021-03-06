import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function MyAppliedProjects() {
  const [handleClick, setHandleClick] = useState(false);
  const { accessToken, userId, source } = useSelector(
    (state) => state.userInfoReducer.userInfo
  );
  const [appliedProject, setAppliedProject] = useState(null)

  const appliedProjects = async () => {
    await axios({
      url: "https://server.joinus.fun/user/info",
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      data: {
        userId: userId,
        source: source,
      },
      withCredentials: true,
    }).then((res) => {
      setAppliedProject(res.data.data);
    });
  };

  const cancelProject = async (projectId) => {
    await axios({
      url: "https://server.joinus.fun/project/cancel",
      method: "POST",
      data: {
        userId: userId,
        projectId: projectId,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }).then(() => {
      setHandleClick(!handleClick);
    });
  };

  useEffect(appliedProjects, [handleClick]);

  return (
    appliedProject ?
    <div className="myProfile-body">
      <div className="applied-border">
        <h2 style={{ textAlign: "center" }}>지원한 프로젝트</h2>
        {appliedProject.waitingProject.map((list) => {
          return (
            <div className="volunteer_lists">
              <h3>{list.projectName}</h3>
              <button
                onClick={() => {
                  cancelProject(list.projectId);
                }}
              >
                지원 취소
              </button>
            </div>
          );
        })}
      </div>
      <div className="applied-border">
        <h2 style={{ textAlign: "center" }}>합류한 프로젝트</h2>
        {appliedProject.acceptProject.map((list) => {
          return (
            <div className="volunteer_lists">
              <h3>{list.projectName}</h3>
            </div>
          );
        })}
      </div> 
      <div className="applied-border">
        <h2 style={{ textAlign: "center" }}>거절된 프로젝트</h2>
        {appliedProject.rejectProject.map((list) => {
          return (
            <div className="volunteer_lists">
              <h3>{list.projectName}</h3>
            </div>
          );
        })}
      </div> 
    </div> :
    <div>'Loading...'</div>
  );
}
