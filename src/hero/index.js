import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import imagesLoaded from "imagesloaded";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const bgSvgs = document.querySelectorAll(".bg-animated_svg");

function initBgMotionPath() {
  // Register MotionPathPlugin here to avoid multiple registrations
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
  ScrollTrigger.normalizeScroll(true);
  // declare an array to store tweens
  let tweens = [];

  // function to create and manage tweens
  function createTweens(bgSvgs) {
    // destroy existing tweens
    tweens.forEach((tween) => {
      tween && tween.kill();
    });
    tweens = [];

    // iterate over each SVG
    bgSvgs.forEach((svg, i) => {
      const pathLength = svg.querySelector("path").getTotalLength();
      const timeToPlay = (pathLength / 100) * 4;
      const timeDelay = Math.floor(Math.random() * 3) + 1;

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
        delay: timeDelay,
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
      createTweens(bgSvgs);
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
    createTweens(bgSvgs);
  }, 200); // Adjust the delay as needed

  // Update tweens on window resize, using the debounced version
  window.addEventListener("resize", debouncedResize);
}

// Call initMotionPath to initialize motion paths
initBgMotionPath();
