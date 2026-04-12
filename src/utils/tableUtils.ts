export const getInitials = (name: string) => {
return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
};

export const avatarColors = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];