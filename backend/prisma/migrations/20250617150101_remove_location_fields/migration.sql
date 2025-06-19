/*
  Warnings:

  - You are about to drop the column `locationX` on the `attraction` table. All the data in the column will be lost.
  - You are about to drop the column `locationY` on the `attraction` table. All the data in the column will be lost.
  - You are about to drop the column `locationX` on the `show` table. All the data in the column will be lost.
  - You are about to drop the column `locationY` on the `show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attraction` DROP COLUMN `locationX`,
    DROP COLUMN `locationY`;

-- AlterTable
ALTER TABLE `show` DROP COLUMN `locationX`,
    DROP COLUMN `locationY`;
