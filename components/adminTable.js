"use client";

import React, { useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { deleteExercise } from "@/app/api/actions";
import AddExerciseForm from "./addExerciseForm";
import EditExerciseForm from "./editExerciseForm";

export default function AdminTable({ exercises }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State to track which view to show
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove it from all programs.`)) return;
    setIsDeleting(true);
    await deleteExercise(id);
    setIsDeleting(false);
  };

  // View Routing: Show Add Form
  if (showAddForm) {
    return <AddExerciseForm onClose={() => setShowAddForm(false)} />;
  }

  // View Routing: Show Edit Form
  if (editingExerciseId) {
    return <EditExerciseForm 
              exerciseId={editingExerciseId} 
              onClose={() => setEditingExerciseId(null)} 
           />;
  }

  // Default View: The Table
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-xl font-bold text-on-surface">Exercise Database</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primary text-[#2b3400] px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-widest font-label">
              <th className="p-4">Exercise Name</th>
              <th className="p-4">Active Programs (Day)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {exercises.map((ex) => (
              <tr key={ex.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-bold text-on-surface">{ex.name}</td>
                <td className="p-4 text-sm text-primary">
                  {ex.associated_programs ? ex.associated_programs : <span className="text-on-surface-variant/50 italic">None</span>}
                </td>
                <td className="p-4 flex justify-end gap-3">
                  
                  {/* EDIT BUTTON */}
                  <button 
                    onClick={() => setEditingExerciseId(ex.id)}
                    className="text-on-surface-variant hover:text-white transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDelete(ex.id, ex.name)}
                    disabled={isDeleting}
                    className="text-on-surface-variant hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}