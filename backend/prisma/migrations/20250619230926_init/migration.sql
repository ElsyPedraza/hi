-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attraction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `waitTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attractionId` INTEGER NOT NULL,
    `waitMinutes` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `show` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `attractionId` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `showId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parkHours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dayOfWeek` INTEGER NOT NULL,
    `openTime` VARCHAR(191) NOT NULL,
    `closeTime` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailyPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyPlanItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `showScheduleId` INTEGER NULL,
    `attractionId` INTEGER NULL,
    `preferredTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `typeId` INTEGER NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validDate` DATETIME(3) NOT NULL,
    `qrCode` VARCHAR(191) NOT NULL,
    `stripeSessionId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `buyerName` VARCHAR(191) NULL,
    `buyerEmail` VARCHAR(191) NULL,
    `buyerPhone` VARCHAR(191) NULL,

    UNIQUE INDEX `ticket_qrCode_key`(`qrCode`),
    UNIQUE INDEX `ticket_stripeSessionId_key`(`stripeSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticketType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `durationDays` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `features` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `waitTime` ADD CONSTRAINT `waitTime_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `show` ADD CONSTRAINT `show_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showSchedule` ADD CONSTRAINT `showSchedule_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `show`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dailyPlan` ADD CONSTRAINT `dailyPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPlanItem` ADD CONSTRAINT `DailyPlanItem_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `dailyPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPlanItem` ADD CONSTRAINT `DailyPlanItem_showScheduleId_fkey` FOREIGN KEY (`showScheduleId`) REFERENCES `showSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPlanItem` ADD CONSTRAINT `DailyPlanItem_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ticketType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
