import React from "react";
import NavBar from "@/components/navBar";
import AdminTable from "@/components/adminTable";
import { mysqlPool } from "@/utils/db";
//me
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
    <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden">
      <NavBar />
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-16">
        <div className="mb-12">
          <span className="text-[12px] text-red-400 font-bold uppercase tracking-widest mb-2 block">
            Developer Access
          </span>
          <h1 className="font-headline text-5xl font-bold uppercase tracking-tighter mb-4 text-white">
            System Admin
          </h1>
          <p className="text-on-surface-variant">
            Manage exercises, update instructions, and modify program junction links.
          </p>
        </div>
        <AdminTable exercises={exercises} />
      </main>
    </div>
  );
}