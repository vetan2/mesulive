import { type Potential } from "~/entities/potential";

export const gradeUrls: Record<Potential.ResetMethod, string> = {
  RED: "https://maplestory.nexon.com/Guide/OtherProbability/cube/red",
  POTENTIAL: "https://maplestory.nexon.com/Guide/OtherProbability/cube/black",
  ADDI: "https://maplestory.nexon.com/Guide/OtherProbability/cube/addi",
  ADDI_POTENTIAL:
    "https://maplestory.nexon.com/Guide/OtherProbability/cube/addi",
  STRANGE: "https://maplestory.nexon.com/Guide/OtherProbability/cube/strange",
  MASTER: "https://maplestory.nexon.com/Guide/OtherProbability/cube/master",
  ARTISAN: "https://maplestory.nexon.com/Guide/OtherProbability/cube/artisan",
  STRANGE_ADDI:
    "https://maplestory.nexon.com/Guide/OtherProbability/cube/strangeAddi",
};

export const cubeItemIds: Record<Potential.ResetMethod, number> = {
  RED: 5062009,
  POTENTIAL: 5062010,
  ADDI: 5062500,
  ADDI_POTENTIAL: 5062500,
  STRANGE: 2711000,
  MASTER: 2711003,
  ARTISAN: 2711004,
  STRANGE_ADDI: 2730002,
};
