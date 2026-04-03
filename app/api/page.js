import React from "react";
import NavBar from "@/components/navBar";
import AdminTable from "@/components/adminTable";
import { mysqlPool } from "@/utils/db";
import styles from "./page.css";
//when i enter api, we will see page of system admin, with table of exercises and their associated programs. From there, we can click edit to edit the exercise info, and add or remove program links. We can also add new exercises, and delete exercises.
export default async function AdminPage() {
  const [exercises] = await mysqlPool.promise().query(`
    SELECT 
      e.id, 
      e.name, 
      GROUP_CONCAT(CONCAT(p.name, ' (', pe.day_category, ')') SEPARATOR ' | ') as associated_programs
    FROM exercises e
    LEFT JOIN program_exercises pe ON e.id = pe.exercise_id
    LEFT JOIN programs p ON pe.program_id = p.id
    GROUP BY e.id
    ORDER BY e.id DESC
  `);

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.devBadge}>
            Developer Access
          </span>
          <h1 className={styles.title}>
            System Admin
          </h1>
          <p className={styles.subtitle}>
            Manage exercises, update instructions, and modify program junction links.
          </p>
        </div>
        <AdminTable exercises={exercises} /> /** component htl ka admin table ko u thone htrr dl */
      </main>
    </div>
  );
}
