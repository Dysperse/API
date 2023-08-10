import interact from "interactjs";
import { useEffect } from "react";

export function WidgetBar({ children }) {
  useEffect(() => {
    interact(".drag-widget").draggable({
      inertia: true,

      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "body",
          endOnly: true,
        }),
      ],

      listeners: {
        move(event) {
          var target = event.target;

          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = "translate(" + x + "px, " + y + "px)";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    });
  }, []);

  return children;
}
