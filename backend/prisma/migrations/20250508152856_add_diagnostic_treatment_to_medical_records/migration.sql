/*
  Warnings:

  - You are about to drop the column `notes` on the `medical_records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "medical_records" DROP COLUMN "notes",
ADD COLUMN     "diagnostic" TEXT,
ADD COLUMN     "time" TIME,
ADD COLUMN     "treatment" TEXT;
