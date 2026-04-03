"use server";

import { mysqlPool } from "@/utils/db";
import { revalidatePath } from "next/cache";

// 1. Delete an Exercise
export async function deleteExercise(exerciseId) {
  try {
    await mysqlPool.promise().query("DELETE FROM exercises WHERE id = ?", [exerciseId]);
    revalidatePath("/api");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    return { success: false, error: error.message };
  }
}

// 2. Add a New Exercise + Program Links
export async function addExercise(exerciseData, assignedPrograms) {
  try {
    const [result] = await mysqlPool.promise().query(
      "INSERT INTO exercises (name, muscle_group_id, video_url, instructions) VALUES (?, ?, ?, ?)",
      [exerciseData.name, exerciseData.muscle_group_id, exerciseData.video_url, exerciseData.instructions]
    );

    const newExerciseId = result.insertId;

    if (assignedPrograms.length > 0) {
      for (const prog of assignedPrograms) {
        await mysqlPool.promise().query(
          "INSERT INTO program_exercises (program_id, exercise_id, day_category, sets, reps) VALUES (?, ?, ?, ?, ?)",
          [prog.programId, newExerciseId, prog.dayCategory, prog.sets, prog.reps]
        );
      }
    }

    revalidatePath("/api"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to add exercise:", error);
    return { success: false, error: error.message };
  }
}

// Add this to the bottom of app/exerciselist/actions.js

// 3. Fetch a single exercise to Edit
export async function getExerciseToEdit(id) {
  // Get the main info
  const [exercises] = await mysqlPool.promise().query("SELECT * FROM exercises WHERE id = ?", [id]);
  
  // Get the junction table info
  const [programs] = await mysqlPool.promise().query("SELECT * FROM program_exercises WHERE exercise_id = ?", [id]);
  
  // Send it back to the React component
  return {
    basic: exercises[0],
    programs: programs
  };
}

// 4. Save the Edited Exercise
export async function updateExercise(id, basicData, assignedPrograms) {
  try {
    // A. Update the main exercise details
    await mysqlPool.promise().query(
      "UPDATE exercises SET name = ?, muscle_group_id = ?, video_url = ?, instructions = ? WHERE id = ?",
      [basicData.name, basicData.muscle_group_id, basicData.video_url, basicData.instructions, id]
    );

    // B. The Magic Trick: Delete all old program links for this exercise
    await mysqlPool.promise().query("DELETE FROM program_exercises WHERE exercise_id = ?", [id]);

    // C. Insert the newly selected program links
    if (assignedPrograms.length > 0) {
      for (const prog of assignedPrograms) {
        await mysqlPool.promise().query(
          "INSERT INTO program_exercises (program_id, exercise_id, day_category, sets, reps) VALUES (?, ?, ?, ?, ?)",
          [prog.programId, id, prog.dayCategory, prog.sets, prog.reps]
        );
      }
    }

    revalidatePath("/api"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to update exercise:", error);
    return { success: false, error: error.message };
  }
}