import {Routes, Route} from "react-router-dom";
import Upload from "../components/upload/Upload";
import DashBoard from "../components/DashBoard";
import paths from "./paths";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.UPLOAD_PATH} element={<Upload/>} />
            <Route path={paths.DASHBOARD_PATH} element={<DashBoard/>} />
        </Routes>
    )
}
export default AppRouter;