-- Reset the sequence for the Skill table
SELECT setval('"Skill_id_seq"', COALESCE((SELECT MAX(id) FROM "Skill"), 1), false); 