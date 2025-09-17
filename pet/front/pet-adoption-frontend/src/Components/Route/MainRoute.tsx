import { Route, Routes } from "react-router-dom";

export function MainRoute()  {
    return (
        <div>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                {/* Define your routes here */}
                
            </Routes>
        </div>
    );
}