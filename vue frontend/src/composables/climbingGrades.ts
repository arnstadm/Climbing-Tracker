// src/composables/climbingGrades.js
// composable for reusing the grades across components
export const climbingGrades = () => {
  const grades = [
    { grade: "1", description: "Walking terrain, no hands needed" },
    { grade: "2", description: "Simple scrambling, hands occasionally" },
    { grade: "3", description: "Easy climbing, may need rope" },
    { grade: "4", description: "Beginner climbing, basic rope work" },
    { grade: "5-", description: "Moderate difficulty, more technique needed" },
    { grade: "5", description: "First real climbing grade" },
    { grade: "5+", description: "Slightly harder, small holds" },
    { grade: "6-", description: "Intermediate climbing, technical movement" },
    { grade: "6", description: "Solid intermediate level" },
    { grade: "6+", description: "Challenging intermediate, pumpy or cruxy" },
    { grade: "7-", description: "Advanced climbing, physical and mental challenge" },
    { grade: "7", description: "Hard advanced climbing" },
    { grade: "7+", description: "Very hard, athletic moves" },
    { grade: "8-", description: "Expert level, strong technique and power" },
    { grade: "8", description: "Elite climbing, redpoint projects" },
    { grade: "8+", description: "Near pro level, demanding routes" },
    { grade: "9-", description: "Elite/pro climbing, rarely onsighted" },
    { grade: "9", description: "World-class difficulty" },
    { grade: "9+", description: "Extreme difficulty, few climbers at this level" },
    { grade: "10-", description: "Cutting edge, only top climbers" },
    { grade: "10", description: "World elite, few ascents worldwide" },
    { grade: "10+", description: "Ultra elite, cutting-edge sport climbing" },
    { grade: "11-", description: "Possibly the hardest in Norway" }
  ];

  return { grades };
};