import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/token";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { accessToken, setAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(true);
      api
        .post("/auth/refresh", {}, { withCredentials: true })
        .then((response) => {
          const newAccessToken = response.data.accessToken;
          console.log(newAccessToken);
          setAuth(newAccessToken, response.data.user);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [accessToken, setAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!accessToken && !loading) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
