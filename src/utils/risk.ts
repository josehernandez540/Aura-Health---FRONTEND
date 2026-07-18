export const getRiskInfo = (diseaseCount: number) => {
    if (diseaseCount <= 3) {
      return {
        label: "Bajo",
        className: "badge status-scheduled",
      };
    }

    if (diseaseCount < 6) {
      return {
        label: "Medio",
        className: "badge status-pending",
      };
    }

    return {
      label: "Alto",
      className: "badge status-cancelled",
    };
  };