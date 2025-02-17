import { Container } from "react-bootstrap";
import ObjsPageLoggedInView from "../components/ObjsPageLoggedInView";
import ObjsPageLoggedOutView from "../components/ObjsPageLoggedOutView";
import styles from "../styles/ObjsPage.module.css";
import UserContext from "../providers/UserProvider";
import { useContext } from "react";

interface ObjsPageProps {}

const ObjsPage = ({}: ObjsPageProps) => {
    const { loggedInUser } = useContext(UserContext);

    return <Container className={styles.objsPage}>{loggedInUser ? <ObjsPageLoggedInView /> : <ObjsPageLoggedOutView />}</Container>;
};

export default ObjsPage;
