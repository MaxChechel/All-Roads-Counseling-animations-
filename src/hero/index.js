import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import imagesLoaded from "imagesloaded";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const svgs = document.querySelectorAll(".bg-animated_svg");

function initMotionPath() {
  // Register MotionPathPlugin here to avoid multiple registrations
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
  ScrollTrigger.normalizeScroll(true);
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
      const pathLength = svg.querySelector("path").getTotalLength();
      const timeToPlay = (pathLength / 100) * 4;

      const movingIcon = svg.querySelector("#moving-icon");

      let svgPath = svg.querySelector(".path-container path");

      // Set the transform origin and offsets before animating
      gsap.set(movingIcon, {
        xPercent: -50, // Center horizontally
        yPercent: -50, // Center vertically
        transformOrigin: "50% 50%", // Set the transform origin to the center
      });

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
        duration: timeToPlay,
        repeat: -1,
        repeatDelay: 1 * i,
        ease: "none",
      });
      tweens.push(tween);
    });
  }

  // Call createTweens on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    imagesLoaded(".page-wrapper", () => {
      createTweens(svgs);
    });
  });

  function debounce(func, delay) {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  // Create a debounced version of the resize function
  const debouncedResize = debounce(function () {
    createTweens(svgs);
  }, 200); // Adjust the delay as needed

  // Update tweens on window resize, using the debounced version
  window.addEventListener("resize", debouncedResize);
}

// Call initMotionPath to initialize motion paths
initMotionPath();
