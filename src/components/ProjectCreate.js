import React,{useState} from "react";
import "../styles/ProjectCreate.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector  } from 'react-redux';
import CategoryFilter from './CategoryFilter'
export default function ProjectCreate() {
  const userInfo = useSelector(state => state.userInfoReducer.userInfo);
  // const renderData = useSelector(state => state.tagDataReducer.renderData);
  const dispatch = useDispatch();
  const [ errorMessage, setErrorMessage ] = useState("")
  const [ projectInfo, setProjectInfo ] = useState({
    projectName:"",
    projectStacks:"",
    attendExpired: "",
    projectDesc:"",
    image_urls:""
    }
  )
  const handleInputValue = (key) => (e) => {
    console.log(e.target.value)  
    setProjectInfo(Object.assign({},projectInfo, {[key]: e.target.value }));
  };
  const history = useHistory();
  const handleCreate = () =>{
    if(!projectInfo.projectName || !projectInfo.attendExpired || !projectInfo.projectDesc) {
      setErrorMessage("프로젝트의 설명을 모두 입력하세요")
      return;
    }
    else {
      setErrorMessage("")
    }
    const joinusServer = 'https://server.joinus.fun/project/create'
    axios
      .post(joinusServer, {
        userId: userInfo.userId,
        level: "",
        projectName: projectInfo.projectName,
        projectStacks: projectInfo.projectStacks,
        attendExpired: projectInfo.attendExpired,
        projectDesc: projectInfo.projectDesc,
        image_urls: projectInfo.image_urls
      },
      { headers:{
        Authorization: `Bearer ${userInfo.accessToken}`,
        "Content-Type": "application/json" 
      }}
      )
      .then(() =>{ 
        history.push("/");
      })
      .catch((err) => { 
        console.log(err);
      });
  }
  return (
    <div className="projectCreate">
      <h1> 프로젝트 생성 페이지 </h1>
      <form className="projectCreate CRTdescribtion">
        <h3> 프로젝트에 대하여 자세히 적어주세요 </h3>
        <div>모든 항목은 필수입니다</div>
        <div className="crtProject">
          <span className="crtLeft"> 프로젝트명</span>
          <input type="text" className ="project-title" 
          onChange={handleInputValue("projectName")}></input> 
        </div>
        <div className="crtProject">
        <span className="crtLeft"> 사용 스택</span>
          <input type="text" className="project-tag"
          onChange={handleInputValue("projectStacks")}></input>
        </div>
        {/* <div className="crtProject">
          <CategoryFilter />
        </div> */}
        <div className="crtProject">
          <span className="crtLeft"> 신청 기한 </span>
          <input type="text" className="project-deadline"
          onChange={handleInputValue("attendExpired")}></input>
        </div>
        <div className="crtProject">
          <span className="crtLeft"> 프로젝트 설명</span>
          <textarea className="project-desc" placeholder='내용을 입력하세요'
          onChange={handleInputValue("projectDesc")}></textarea>
        </div>
        <div className="crtProject">
          <span className="crtLeft">이미지</span>
          <input type="file" name="imgFile" id="imgFile" ></input>
          <img className="image"/> 
        </div>
      </form>
      <div >
        <button className="createbtn" onClick={handleCreate}> 프로젝트 생성 </button>
      </div>
      {errorMessage 
      ?
        <div className="alert-box">
          {errorMessage}
        </div> 
      : ''}
    </div>
  );
}