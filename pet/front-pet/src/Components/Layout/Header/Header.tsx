import { Menu } from "../Menu/Menu";

export function Header()  {
    return (
        <div className="Header">
            <div className="LogoImage">
                <img src="/logo192.png" alt="logo" width={50} height={50} />
            </div>
            <div className="title">
                <Menu/>
            </div>
            
        </div>
    );
}