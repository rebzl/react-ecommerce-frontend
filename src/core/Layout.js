import Menu from "./Menu";
import "../style.css";

/**
 * Call the layout from any other component and pass the parameters.
 * @param {*} param0 title, description, className, children
 * @returns
 */
const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => (
  <div>
    <Menu />
    <div className="card jumbotron">
      <div>
        <h2>{title}</h2>
        <p className="lead">{description}</p>
      </div>
    </div>
    <div className={className}>{children}</div>
  </div>
);

export default Layout;
