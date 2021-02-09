const SCREEN_COUNT = 2;
const SCROLL_SPEED = 30;
const MIN_MOVEMENT_X = 2;
const MIN_MOVEMENT_Y = 10;
const PROJECTS_COUNT = 3;
const MOVE_SPEED = 2;

class Scroll {
  constructor() {
    this.app = null;
    this.aboutMeBtn = null;
    this.projectsBtn = null;
    this.skillsBtn = null;
    this.projects = null;

    this.scrollTo = 0;
    this.scrollFrom = 0;
    this.scrollDistance = 0;
    this.currentView = 0;
    this.projectsScroll = 0;

    this.isScrolling = false;
    this.isYDrag = false;
    this.isXDrag = false;
  }

  getPage() {
    this.app = document.getElementById('cv-page-app');
    this.aboutMeBtn = document.getElementById('top');
    this.projectsBtn = document.getElementById('middle');
    this.skillsBtn = document.getElementById('bottom');
    this.projects = document.getElementById('projects-scroll');
  }

  controlPage() {
    this.aboutMeBtn.addEventListener('click', this.scrollPage.bind(this));
    this.skillsBtn.addEventListener('click', this.scrollPage.bind(this));
    this.projectsBtn.addEventListener('click', this.scrollPage.bind(this));

    this.app.addEventListener('touchstart', this.allowYTouchMove.bind(this));
    this.app.addEventListener('touchmove', this.animateYTouchMove.bind(this));
    this.app.addEventListener('touchend', this.stopYTouchMove.bind(this));

    this.app.addEventListener('mousedown', this.allowYDrag.bind(this));
    this.app.addEventListener('mousemove', this.animateYDrag.bind(this));
    this.app.addEventListener('mouseup', this.stopYDrag.bind(this));

    window.addEventListener('wheel', this.replaceScroll.bind(this));

    this.projects.addEventListener('mousedown', this.allowXDrag.bind(this));
    this.projects.addEventListener('mousemove', this.animateXDrag.bind(this));
    this.projects.addEventListener('mouseup', this.stopXDrag.bind(this));
  }

  initScroll() {
    this.isScrolling = true;
    this.scrollFrom = window.innerHeight * this.currentView;
    this.aboutMeBtn.classList.remove('current');
    this.projectsBtn.classList.remove('current');
    this.skillsBtn.classList.remove('current');
  }

  startScroll() {
    switch (this.currentView) {
      case 0: {
        this.aboutMeBtn.classList.add('current');
        break;
      }
      case 1: {
        this.projectsBtn.classList.add('current');
        break;
      }
      case 2: {
        this.skillsBtn.classList.add('current');
        break; 
      }
      default: break;
    }
    this.scrollDistance = Math.abs(this.scrollFrom - this.scrollTo);
    this.scrollAnimation();
  }

  scrollAnimation() {
    if (this.scrollDistance - SCROLL_SPEED > 0) {
      this.scrollDistance -= SCROLL_SPEED;
      if (this.scrollFrom < this.scrollTo && this.scrollFrom < window.innerHeight * this.currentView) {
        this.scrollFrom += SCROLL_SPEED;
        this.app.style.top = `${-this.scrollFrom}px`;
        requestAnimationFrame(this.scrollAnimation.bind(this));
      }
      if (this.scrollFrom > this.scrollTo && this.scrollFrom > window.innerHeight * this.currentView) {
        this.scrollFrom -= SCROLL_SPEED;
        this.app.style.top = `${-this.scrollFrom}px`;
        requestAnimationFrame(this.scrollAnimation.bind(this));
      }
    } else {
      requestAnimationFrame(this.stopScrolling.bind(this));
    }
  }

  stopScrolling() {
    this.app.style.top = `${-this.currentView * window.innerHeight}px`;
    this.isScrolling = false;
    this.stopYTouchMove();
    this.stopYDrag();
    this.stopXDrag();
  }

  scrollPage(event) {
    this.initScroll();
    switch (event.target.id) {
      case 'top': {
        this.aboutMeBtn.classList.add('current');
        this.scrollTo = 0;
        this.currentView = 0;
        break;
      }
      case 'middle': {
        this.projectsBtn.classList.add('current');
        this.scrollTo = window.innerHeight;
        this.currentView = 1;
        break;
      }
      case 'bottom': {
        this.skillsBtn.classList.add('current');
        this.scrollTo = window.innerHeight * 2;
        this.currentView = 2;
        break;
      }
      default: break;
    }
    this.scrollDistance = Math.abs(this.scrollFrom - this.scrollTo);
    this.scrollAnimation();
  }

  replaceScroll(event) {
    if (!this.isScrolling) {
      this.initScroll();
      if (event.deltaY > 0 && this.currentView < SCREEN_COUNT) {
        this.scrollTo = this.scrollFrom + window.innerHeight;
        this.currentView += 1;
      }
      if (event.deltaY < 0 && this.currentView > 0) {
        this.scrollTo = this.scrollFrom - window.innerHeight;
        this.currentView -= 1;
      }
      this.startScroll();
    }
  }

  allowYTouchMove(event) {
    this.isYDrag = true;
    const startTouch = event.touches[0];
    this.xTouchStart = startTouch.clientX;
    this.yTouchStart = startTouch.clientY;
  }

  animateYTouchMove(event) {
    const moveTouch = event.touches[0];
    const xTouchMove = moveTouch.clientX;                                 
    const yTouchMove =moveTouch.clientY;
    const xDiff = this.xTouchStart - xTouchMove;
    const yDiff = this.yTouchStart - yTouchMove;
    if (
      !this.isScrolling
      && Math.abs(yDiff) > Math.abs(xDiff)
    ) {
      this.initScroll();
      if (yDiff < 0 && this.currentView > 0) {
        this.scrollTo = this.scrollFrom - window.innerHeight;
        this.currentView -= 1;
      }
      if (yDiff > 0 && this.currentView < SCREEN_COUNT) {
        this.scrollTo = this.scrollFrom + window.innerHeight;
        this.currentView += 1;
      }
      this.startScroll();
    }
  }

  stopYTouchMove() {
    this.isYDrag = false;
    this.xTouchStart = null;
    this.yTouchStart = null;
  }

  allowYDrag() {
    this.isYDrag = true;
  }

  animateYDrag(event) {
    event.preventDefault();
    if (
      this.isYDrag
      && !this.isScrolling
      && Math.abs(event.movementY) > MIN_MOVEMENT_Y
      && Math.abs(event.movementX) < MIN_MOVEMENT_X
    ) {
      this.initScroll();
      if (event.movementY > 0 && this.currentView > 0) {
        this.scrollTo = this.scrollFrom - window.innerHeight;
        this.currentView -= 1;
      }
      if (event.movementY < 0 && this.currentView < SCREEN_COUNT) {
        this.scrollTo = this.scrollFrom + window.innerHeight;
        this.currentView += 1;
      }
      this.startScroll();
    }
  }

  stopYDrag() {
    this.isYDrag = false;
  }

  allowXDrag() {
    this.isXDrag = true;
  }

  animateXDrag(event) {
    event.preventDefault();
    if (
      this.isXDrag
      && Math.abs(event.movementX) > MIN_MOVEMENT_X
      && Math.abs(event.movementY) < MIN_MOVEMENT_Y
    ) {
      this.projects.scroll(this.projectsScroll + event.movementX * MOVE_SPEED, 0);
      this.projectsScroll -= event.movementX * MOVE_SPEED;
      if (this.projectsScroll < 0) {
        this.projects.scroll(0, 0);
        this.projectsScroll = 0;
      }
      if (this.projectsScroll > window.innerWidth * PROJECTS_COUNT) {
        this.projects.scroll(window.innerWidth * PROJECTS_COUNT, 0);
        this.projectsScroll = window.innerWidth * PROJECTS_COUNT;
      }
    }
  }

  stopXDrag() {
    this.isXDrag = false;
  }
}

export default Scroll;
