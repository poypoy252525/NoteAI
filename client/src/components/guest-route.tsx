import { api } from "@/services/axios-instance";
import { useToken } from "@/stores/token";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GuestRoute = () => {
  const { accessToken } = useToken();
  const navigate = useNavigate();
  console.log(accessToken);

  useEffect(() => {
    api
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((response) => {
        const newAccessToken = response.data.accessToken;
        if (newAccessToken) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken, navigate]);

  return <Outlet />;
};

export default GuestRoute;
