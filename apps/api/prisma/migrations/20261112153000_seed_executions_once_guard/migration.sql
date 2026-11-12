-- SCRUM-116: Record successful demo seed execution.
-- The marker will be committed atomically with the seed data.

CREATE TABLE "seed_executions" (
    "seed_key" TEXT NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seed_executions_pkey" PRIMARY KEY ("seed_key")
);
