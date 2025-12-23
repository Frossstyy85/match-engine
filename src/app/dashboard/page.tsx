import Sidebar from "@/components/Sidebar";
import styles from "./Dashboard.module.css"

export default function Dashboard() {
    return (
        <div className={styles.page}>
            <Sidebar/>
            <main className={styles.content}>
                <h1>hello from dashboard</h1>
            </main>
        </div>
    )
}


