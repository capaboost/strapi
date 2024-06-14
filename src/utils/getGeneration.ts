import { GENERATIONS } from "../configurations/constants"

const getGeneration = (year: number): { generation: string, group: 'OLD' | 'MIDDLE' | 'YOUNG' } => {
  for (const generation in GENERATIONS) {
      const genInfo = GENERATIONS[generation];
      if (genInfo.OLD.includes(year)) {
          return { generation: generation, group: 'OLD' };
      } else if (genInfo.MIDDLE.includes(year)) {
          return { generation: generation, group: 'MIDDLE' };
      } else if (genInfo.YOUNG.includes(year)) {
          return { generation: generation, group: 'YOUNG' };
      }
  }

  // default return if logic fails
  return {
    generation: 'GEN_ALPHA',
    group: 'OLD',
  };
};

export default getGeneration;