-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deletedFor" TEXT[] DEFAULT ARRAY[]::TEXT[];
