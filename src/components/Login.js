import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { setLoginStatus, setUserInfo } from "../actions/index";
import "../styles/LoginSignup.css";
import { validateEmail, validatePassword } from "../utils/validate";
import Modal from "./Modal";

axios.defaults.withCredentials = true;

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [singInInfo, setSignInInfo] = useState({
    userEmail: "",
    password: "",
    isLogin: false,
    errorMsg: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => {
    setModalOpen(false);
    history.push("/");
  };

  const { userEmail, password, errorMsg, isLogin } = singInInfo;

  const inputHandler = (key) => (e) => {
    setSignInInfo({
      ...singInInfo,
      [key]: e.target.value,
    });
  };

  useEffect(() => {
    if (isLogin) {
      return () => dispatch(setLoginStatus(true));
    }
  }, [isLogin]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    if (authorizationCode) {
      axios({
        url: "https://server.joinus.fun/user/authlogin",
        method: "POST",
        data: {
          authorizationCode: authorizationCode,
        },
        withCredentials: true,
      })
        .then((res) => {
          dispatch(setUserInfo(res.data));
          setSignInInfo({
            ...singInInfo,
            isLogin: true,
          });
          setModalOpen(true);
        })
        .catch((error) => console.log(error.message));
    }
  }, []);

  const handleLogin = async () => {
    const joinusServer = "https://server.joinus.fun/user/login";
    if (!userEmail || !password) {
      return setSignInInfo({
        ...singInInfo,
        errorMsg: "❗️ 이메일과 비밀번호를 모두 입력하세요",
      });
    }

    if (!validateEmail(userEmail) || !validatePassword(password)) {
      return setSignInInfo({
        ...singInInfo,
        errorMsg: "❗️ 이메일 혹은 비밀번호가 올바르지 않습니다",
      });
    }

    try {
      const res = await axios.post(joinusServer, { userEmail, password });
      dispatch(setUserInfo(res.data.data));
      setSignInInfo({
        ...singInInfo,
        isLogin: true,
      });
      setModalOpen(true);
    } catch (error) {
      return !error.response
        ? setSignInInfo({
            ...singInInfo,
            errorMsg: "❗️ 서버 오류, 잠시 후 다시 시도해주세요",
          })
        : setSignInInfo({
            ...singInInfo,
            errorMsg: "❗️ 이메일 혹은 비밀번호가 일치하지 않습니다",
          });
    }
  };

  const socialLoginHandler = () => {
    const GOOGLE_LOGIN_URL =
      "https://accounts.google.com/o/oauth2/auth?client_id=928822058916-4cl3iej3veoov69s7jq64limd02bpdak.apps.googleusercontent.com&redirect_uri=https://joinus.fun/login&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&response_type=code&access_type=offline";
    window.location.assign(GOOGLE_LOGIN_URL);
  };

  const inlineBlockStyle = { display: "inline-block" };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Social 로그인</h2>
          <button
            type="button"
            className="googleBtn"
            onClick={socialLoginHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="18"
              height="18"
              viewBox="0 0 172 172"
            >
              <g>
                <path d="M0,172v-172h172v172z" fill="none" />
                <g fill="#ffffff">
                  <path d="M89.42656,165.12c-43.63156,0 -79.13344,-35.48844 -79.13344,-79.12c0,-43.63156 35.50187,-79.12 79.13344,-79.12c19.76656,0 38.68656,7.32344 53.29312,20.62656l2.66063,2.43219l-26.09563,26.09563l-2.41875,-2.06938c-7.65937,-6.5575 -17.40156,-10.17219 -27.43937,-10.17219c-23.27375,0 -42.22063,18.93344 -42.22063,42.20719c0,23.27375 18.94688,42.20719 42.22063,42.20719c16.78344,0 30.04625,-8.57312 36.29469,-23.17969h-39.73469v-35.62281l77.57469,0.1075l0.57781,2.72781c4.04469,19.20219 0.80625,47.44781 -15.5875,67.65781c-13.57188,16.72969 -33.45938,25.22219 -59.125,25.22219z" />
                </g>
              </g>
            </svg>
            <div className="googleBtnTxt">Google 계정으로 로그인</div>
          </button>
          <h2>Email 로그인</h2>
          <div>
            <input
              type="email"
              value={userEmail}
              placeholder="이메일을 입력하세요"
              maxLength="30"
              onChange={inputHandler("userEmail")}
            />
            <input
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              maxLength="16"
              onChange={inputHandler("password")}
            />
            <button className="btn-login" type="submit" onClick={handleLogin}>
              로그인하기
            </button>
            {errorMsg ? <div className="alert-box">{errorMsg}</div> : ""}
            <div className="additionalNotice">
              <div style={inlineBlockStyle}>아직 회원이 아니신가요? </div>
              <Link className="additionalNotice link" to="/signup">
                가입하러 가기
              </Link>
            </div>
          </div>
        </form>
        {modalOpen ? (
          <Modal
            open={modalOpen}
            close={closeModal}
            message="조인어스에 오신걸 환영합니다"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Login;
