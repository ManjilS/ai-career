-- CreateTable
CREATE TABLE "RoadmapHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "careerGoal" TEXT NOT NULL,
    "roadmapData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadmapHistory_userId_idx" ON "RoadmapHistory"("userId");

-- AddForeignKey
ALTER TABLE "RoadmapHistory" ADD CONSTRAINT "RoadmapHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
