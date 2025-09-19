import { Route, Routes } from "react-router-dom";
import { Page404 } from "../Pages/Page404";
import { Login } from "../Pages/Login";
import { Home } from "../Pages/Home";

export function MainRoute()  {
    return (
        <div>
            <Routes>
                <Route path="/home" element={<Home/>} />
                 <Route path="/login" element={<Login/>} />
                {/* Define your routes here */}
                <Route path="/about" element={<h1>About Page</h1>} />
                <Route path="*" element={<Page404/>} />
            </Routes>
        </div>
    );
}