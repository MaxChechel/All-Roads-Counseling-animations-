import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import imagesLoaded from "imagesloaded";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const svgs = document.querySelectorAll(".svg-parent");
function setViewBox(svg, svgPath) {
  const svgContainer = svg.parentElement;
  const svgWidth = svgContainer.clientWidth;
  const svgHeight = svgContainer.clientHeight;

  // Get the bounding box of the SVG path
  const pathBounds = svgPath.getBBox();
  const pathAspectRatio = pathBounds.width / pathBounds.height;

  // Calculate the viewBox dimensions based on the aspect ratio of the path
  let viewBoxWidth, viewBoxHeight;
  if (svgWidth / svgHeight > pathAspectRatio) {
    viewBoxWidth = pathBounds.width;
    viewBoxHeight = viewBoxWidth * (svgHeight / svgWidth);
  } else {
    viewBoxHeight = pathBounds.height;
    viewBoxWidth = viewBoxHeight * (svgWidth / svgHeight);
  }

  // Set the viewBox attribute of the SVG
  svg.setAttribute(
    "viewBox",
    `${pathBounds.x} ${pathBounds.y} ${viewBoxWidth} ${viewBoxHeight}`
  );
  console.log("viewbox set");
}

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
      let startPosition = "0%";
      i > 0 ? (startPosition = "60%") : (startPosition = "0%");
      const movingIcon = svg.querySelector("#moving-icon");

      let svgPath = null;
      if (window.innerWidth >= 480) {
        // Desktop
        svgPath = svg.querySelector(".path-container.is-desktop path");
      } else {
        // Mobile
        svgPath = svg.querySelector(".path-container.is-mobile path");
      }

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
          //end: 1,
        },
        ease: "none",
        scrollTrigger: {
          trigger: svg,
          start: `top ${startPosition}`,
          end: "bottom 80%",
          scrub: 2.5,
        },
      });
      tweens.push(tween);
    });
  }

  // Call createTweens on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    imagesLoaded(".page-wrapper", () => {
      svgs.forEach((svg) => {
        const svgPath = svg.querySelector("path");
        setViewBox(svg, svgPath);
      });
      setTimeout(() => {
        createTweens(svgs);
      }, 1000);
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
    svgs.forEach((svg) => {
      const svgPath = svg.querySelector("path");
      setViewBox(svg, svgPath);
    });
    createTweens(svgs);
  }, 200); // Adjust the delay as needed

  // Update tweens on window resize, using the debounced version
  window.addEventListener("resize", debouncedResize);
}

// Call initMotionPath to initialize motion paths
initMotionPath();
