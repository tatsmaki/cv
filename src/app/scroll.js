import htmlData from "./htmlData";

const SCREEN_COUNT = 2;
const SCROLL_SPEED = 30;
const MIN_MOVEMENT_X = 1;
const PROJECTS_COUNT = 2;
const MOVE_SPEED = 2;

class Scroll {
  constructor() {
    this.scrollTo = 0;
    this.scrollFrom = 0;
    this.scrollDistance = 0;
    this.currentView = 0;
    this.projectsScroll = 0;
  }

  createPage() {
    this.app = document.createElement('div');
    this.header = document.createElement('header');
    this.aboutMeBtn = document.createElement('button');
    this.skillsBtn = document.createElement('button');
    this.projectsBtn = document.createElement('button');
    this.aboutMe = document.createElement('section');
    this.skills = document.createElement('section');
    this.projects = document.createElement('section');
    this.projectsWrapper = document.createElement('div');
    this.minecraftProject = document.createElement('div');
    this.footer = document.createElement('footer');

    this.app.classList.add('cv-page');
    this.header.classList.add('header');
    this.aboutMeBtn.classList.add('header-btn', 'current');
    this.skillsBtn.classList.add('header-btn');
    this.projectsBtn.classList.add('header-btn');
    this.aboutMeBtn.id = 'top';
    this.projectsBtn.id = 'middle';
    this.skillsBtn.id = 'bottom';
    this.aboutMe.classList.add('about-me');
    this.skills.classList.add('skills');
    this.projects.classList.add('projects');
    this.projectsWrapper.classList.add('projects-wrapper');
    this.minecraftProject.classList.add('project');
    this.footer.classList.add('contacts');

    this.aboutMeBtn.textContent = 'About me';
    this.projectsBtn.textContent = 'My Projects';
    this.skillsBtn.textContent = 'Skills';
    this.aboutMe.innerHTML = htmlData.about;
    this.minecraftProject.innerHTML = htmlData.minecraft;
    this.skills.innerHTML = htmlData.skills;
    this.footer.innerHTML = htmlData.contacts;

    this.header.append(this.aboutMeBtn, this.projectsBtn, this.skillsBtn);
    this.projects.append(this.projectsWrapper);
    this.projectsWrapper.append(this.minecraftProject);
    this.app.append(this.header, this.aboutMe, this.projects, this.skills, this.footer);
    document.body.append(this.app);
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
