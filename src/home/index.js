import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function initMotionPath() {
  // Register MotionPathPlugin here to avoid multiple registrations
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

  // declare an array to store tweens
  let tweens = [];

  // function to create and manage tweens
  function createTweens(svgs) {
    // destroy existing tweens
    tweens.forEach((tween) => {
      tween && tween.kill();
    });
    tweens = [];

    // iterate over each SVG
    svgs.forEach((svg, i) => {
      let startPosition = "0%";
      i > 0 ? (startPosition = "50%") : (startPosition = "0%");
      const movingIcon = svg.querySelector("#moving-icon");

      let svgPath = null;
      if (window.innerWidth >= 480) {
        // Desktop
        svgPath = svg.querySelector(".path-container.is-desktop path");
      } else {
        // Mobile
        svgPath = svg.querySelector(".path-container.is-mobile path");
      }

      const tween = gsap.to(movingIcon, {
        motionPath: {
          path: svgPath,
          align: svgPath,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
          offsetX: 0,
          offsetY: 0,
          start: 0,
          end: 1,
        },
        ease: "none",
        scrollTrigger: {
          trigger: svg,
          start: `top ${startPosition}`,
          end: "bottom 80%",
          scrub: 2,
        },
      });
      tweens.push(tween);
    });
  }

  // Call createTweens on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    const svgs = document.querySelectorAll(".svg-parent");
    createTweens(svgs);
  });

  // Update tweens on window resize
  window.addEventListener("resize", function () {
    const svgs = document.querySelectorAll(".svg-parent");
    createTweens(svgs);
  });
}

// Call initMotionPath to initialize motion paths
initMotionPath();
