import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MyProfile from "../components/MyProfile";
import MyProject from "../components/MyProjects";
import MyAppliedProjects from "../components/MyAppliedProjects";
import "../styles/MyPage.css";
export default function Mypage() {
  const [userInfoDetail, setuserInfoDetail] = useState();
  const [myData, setmyData] = useState(false);
  const { userId, accessToken, source } = useSelector(
    (state) => state.userInfoReducer.userInfo
  );
  useEffect(() => {
    axios({
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
      setuserInfoDetail(res.data.data);
    });
  }, [myData]);

  const ProjectDelete = async (projectId) => {
    if (window.confirm("삭제하시겠습니다")) {
      await axios({
        url: "https://server.joinus.fun/project/delete",
        method: "POST",
        data: {
          userId: userId,
          projectId: projectId,
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }).then(() => {
        setmyData(!myData);
      });
    }
  };

  return (
    <div>
      {userInfoDetail ? (
        <div>
          <div>
            <MyProfile userInfoDetail={userInfoDetail} />
          </div>
          <div>
            <MyProject
              userInfoDetail={userInfoDetail}
              ProjectDelete={ProjectDelete}
            />
          </div>
          <div>
            <MyAppliedProjects userInfoDetail={userInfoDetail} />
          </div>
        </div>
      ) : (
        <div>
          <img className="loading" src="../loading.gif" alt="loading" />
        </div>
      )}
    </div>
  );
}
