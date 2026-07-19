import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";
import { getTourSteps } from "./tourSteps";
import { useTourStore } from "../../store/tour.store";

export const useProductTour = () => {
  const navigate = useNavigate();
  const markTourSeen = useTourStore((state) => state.markTourSeen);

  const startTour = useCallback(
    (role: string | null, userId: string) => {
      const steps = getTourSteps(role);
      if (!steps.length) return;

      const goToStepRoute = (index: number) => {
        const target = steps[index];
        if (target?.route && window.location.pathname !== target.route) {
          navigate(target.route);
        }
      };

      const driveSteps: DriveStep[] = steps.map((step) => ({
        element: step.selector || undefined,
        popover: {
          title: step.title,
          description: step.description,
          side: step.placement === "center" ? undefined : step.placement,
          align: "start",
        },
      }));

      const driverObj = driver({
        showProgress: true,
        progressText: "Paso {{current}} de {{total}}",
        nextBtnText: "Siguiente",
        prevBtnText: "Atrás",
        doneBtnText: "Finalizar",
        overlayColor: "rgba(10, 12, 16, 0.72)",
        stagePadding: 6,
        stageRadius: 8,
        allowClose: true,
        waitForElement: 2000,
        popoverClass: "aura-tour-popover",
        steps: driveSteps,
        onNextClick: (_el, _step, opts) => {
          const current = opts.state.activeIndex ?? 0;
          goToStepRoute(current + 1);
          opts.driver.moveNext();
        },
        onPrevClick: (_el, _step, opts) => {
          const current = opts.state.activeIndex ?? 0;
          goToStepRoute(current - 1);
          opts.driver.movePrevious();
        },
        onDoneClick: () => driverObj.destroy(),
        onCloseClick: () => driverObj.destroy(),
        // Fires however the tour ends (done, close button, escape) — single
        // source of truth for "don't show it again" instead of duplicating
        // the call in every exit handler.
        onDestroyed: () => markTourSeen(userId),
      });

      goToStepRoute(0);
      driverObj.drive();
    },
    [navigate, markTourSeen]
  );

  return { startTour };
};
