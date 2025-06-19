/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `stripeSessionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ticket_stripeSessionId_key` ON `Ticket`(`stripeSessionId`);
