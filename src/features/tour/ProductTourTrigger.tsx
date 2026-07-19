import { useEffect } from "react";
import { useAuthStore } from "../auth/store/auth.store";
import { useTourStore } from "../../store/tour.store";
import { useProductTour } from "./useProductTour";

const START_DELAY_MS = 600;

const ProductTourTrigger: React.FC = () => {
  const { role, userId } = useAuthStore();
  const hasSeenTour = useTourStore((state) => state.hasSeenTour);
  const { startTour } = useProductTour();

  useEffect(() => {
    if (!userId || !role) return;
    if (hasSeenTour(userId)) return;

    const timer = setTimeout(() => startTour(role, userId), START_DELAY_MS);
    return () => clearTimeout(timer);
    // Only re-evaluate on identity change — starting the tour is a one-shot
    // action per login, not something that should re-fire on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  return null;
};

export default ProductTourTrigger;
