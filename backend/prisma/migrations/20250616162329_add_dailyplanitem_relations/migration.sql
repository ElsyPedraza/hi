/*
  Warnings:

  - You are about to drop the column `itemId` on the `dailyplanitem` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `dailyplanitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dailyplanitem` DROP COLUMN `itemId`,
    DROP COLUMN `itemType`,
    ADD COLUMN `attractionId` INTEGER NULL,
    ADD COLUMN `showScheduleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DailyPlanItem` ADD CONSTRAINT `DailyPlanItem_showScheduleId_fkey` FOREIGN KEY (`showScheduleId`) REFERENCES `ShowSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPlanItem` ADD CONSTRAINT `DailyPlanItem_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `Attraction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
