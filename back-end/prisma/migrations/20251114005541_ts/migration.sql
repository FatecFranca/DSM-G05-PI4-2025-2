-- AlterTable
ALTER TABLE `listacontrole` ADD COLUMN `veiculoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ListaControle` ADD CONSTRAINT `ListaControle_veiculoId_fkey` FOREIGN KEY (`veiculoId`) REFERENCES `Veiculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
