const SCREEN_COUNT = 2;
const SCROLL_SPEED = 30;
const MIN_MOVEMENT_X = 1;
const PROJECTS_COUNT = 3;
const MOVE_SPEED = 2;

class Scroll {
  constructor() {
    this.scrollTo = 0;
    this.scrollFrom = 0;
    this.scrollDistance = 0;
    this.currentView = 0;
    this.projectsScroll = 0;
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
    window.addEventListener('wheel', this.replaceScroll.bind(this));
    this.projects.addEventListener('mousedown', this.allowDrag.bind(this));
    this.projects.addEventListener('mousemove', this.animateDrag.bind(this));
    this.projects.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  scrollPage(event) {
    this.isScrolling = true;
    this.scrollFrom = window.innerHeight * this.currentView;
    this.aboutMeBtn.classList.remove('current');
    this.skillsBtn.classList.remove('current');
    this.projectsBtn.classList.remove('current');
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
      this.isScrolling = true;
      this.scrollFrom = window.innerHeight * this.currentView;
      this.aboutMeBtn.classList.remove('current');
      this.projectsBtn.classList.remove('current');
      this.skillsBtn.classList.remove('current');
      if (event.deltaY > 0 && this.currentView < SCREEN_COUNT) {
        this.scrollTo = this.scrollFrom + window.innerHeight;
        this.currentView += 1;
      }
      if (event.deltaY < 0 && this.currentView > 0) {
        this.scrollTo = this.scrollFrom - window.innerHeight;
        this.currentView -= 1;
      }
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
  }

  allowDrag() {
    this.isDragging = true;
  }

  animateDrag(event) {
    event.preventDefault();
    if (this.isDragging && Math.abs(event.movementX) > MIN_MOVEMENT_X) {
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

  stopDrag() {
    this.isDragging = false;
  }
}

export default Scroll;
