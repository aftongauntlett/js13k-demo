// Tutorial overlay system for explaining game mechanics and electron physics
class Tutorial {
  constructor(game) {
    this.game = game;
    this.isVisible = false;
    this.currentStep = 0;
    this.totalSteps = 4;
    this.overlay = null;
    this.hasBeenShown = localStorage.getItem("atomicTutorialShown") === "true";

    this.steps = [
      {
        title: "Welcome to Atomic Assembly!",
        content: `
          <div class="tutorial-content">
            <h3>Learn Real Atomic Physics!</h3>
            <p>You'll build atoms by placing electrons in their correct orbitals, learning how real atoms work!</p>
            <div class="physics-key">
              <h4>Your Mission:</h4>
              <p>- Each level shows a real chemical element (H, He, Li, C, N)</p>
              <p>- Place electrons in the correct orbital positions</p>
              <p>- Learn about electron spins and quantum mechanics!</p>
            </div>
          </div>
        `,
        buttonText: "Continue",
      },
      {
        title: "Understanding Electron Spins",
        content: `
          <div class="tutorial-content">
            <h3>The Science Behind the Colors</h3>
            <div class="spin-explanation">
              <div class="spin-demo">
                <div class="orb blue-orb"></div>
                <div class="spin-label">
                  <strong>Blue Orbs = Spin-Down <div class="orb-inline blue-orb"></div></strong><br>
                  <small>Electrons spinning in one direction</small>
                </div>
              </div>
              <div class="spin-demo">
                <div class="orb orange-orb"></div>
                <div class="spin-label">
                  <strong>Orange Orbs = Spin-Up <div class="orb-inline orange-orb"></div></strong><br>
                  <small>Electrons spinning in the opposite direction</small>
                </div>
              </div>
            </div>
            <p class="physics-fact">
              <strong>Real Physics:</strong> Electrons have a quantum property called "spin". 
              Each orbital can hold up to 2 electrons, but they must have opposite spins. 
              Some atoms like Hydrogen have only 1 electron, leaving orbitals half-filled.
            </p>
          </div>
        `,
        buttonText: "Continue",
      },
      {
        title: "How to Play",
        content: `
          <div class="tutorial-content">
            <h3>Game Controls</h3>
            <div class="controls-grid">
              <div class="control-item">
                <strong>Mouse Physics:</strong> Your mouse cursor attracts and repels electrons - use physics to guide them!
              </div>
              <div class="control-item">
                <strong>Target Mechanics:</strong> Blue electrons attract to blue targets, orange electrons repel to orange targets
              </div>
              <div class="control-item">
                <strong>Penalties:</strong> Hitting opposing targets causes penalties. Hitting filled targets twice knocks electrons out!
              </div>
              <div class="control-item">
                <strong>Time Limit:</strong> Complete each atom before time runs out
              </div>
              <div class="control-item">
                <strong>Level Up:</strong> Each element gets more complex with more electrons!
              </div>
            </div>
          </div>
        `,
        buttonText: "Continue",
      },
      {
        title: "Pro Tips for Success",
        content: `
          <div class="tutorial-content">
            <h3>Master the Physics!</h3>
            <div class="tips-list">
              <div class="tip">
                <strong>Pauli Exclusion Principle:</strong><br>
                Each orbital can hold up to 2 electrons maximum, and they must have opposite spins if both are present
              </div>
              <div class="tip">
                <strong>Hund's Rule:</strong><br>
                Electrons prefer to occupy empty orbitals first before pairing up (you'll see this in Carbon and Nitrogen!)
              </div>
              <div class="tip">
                <strong>Audio Cues:</strong><br>
                Listen for different sounds - successful captures, collisions, and level completions all have unique audio feedback
              </div>
              <div class="tip">
                <strong>Read the Facts:</strong><br>
                Each element includes real scientific facts about its properties and behavior!
              </div>
            </div>
          </div>
        `,
        buttonText: "Start Game",
      },
    ];
  }

  show() {
    this.isVisible = true;
    this.currentStep = 0;
    this.createOverlay();
    this.updateContent();
  }

  hide() {
    this.isVisible = false;
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    // Mark tutorial as shown
    localStorage.setItem("atomicTutorialShown", "true");
    this.hasBeenShown = true;
  }

  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "tutorial-overlay";
    this.overlay.innerHTML = `
      <div class="tutorial-modal">
        <div class="tutorial-header">
          <div class="step-indicator">
            <span class="current-step">1</span> / <span class="total-steps">${this.totalSteps}</span>
          </div>
          <button class="tutorial-close" onclick="tutorial.hide()">X</button>
        </div>
        <div class="tutorial-body">
          <h2 class="tutorial-title"></h2>
          <div class="tutorial-text"></div>
        </div>
        <div class="tutorial-footer">
          <button class="tutorial-prev" onclick="tutorial.previousStep()" style="display: none;">Previous</button>
          <button class="tutorial-next" onclick="tutorial.nextStep()">Next</button>
        </div>
      </div>
    `;

    // Add CSS styles - matching the subtle level complete menu colors
    const style = document.createElement("style");
    style.textContent = `
      /* Color theme matching level complete screen */
      :root {
        --primary-bg: #000000;
        --secondary-bg: #1a1a1a;
        --border-color: rgb(100, 150, 255);
        --title-color: rgb(255, 255, 100);
        --heading-color: rgb(100, 200, 255);
        --text-color: rgb(200, 200, 200);
        --accent-color: rgb(255, 200, 100);
        --subtle-bg: rgba(50, 50, 80, 0.3);
      }

      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        font-family: "Courier New", monospace;
      }

      .tutorial-modal {
        background: var(--primary-bg);
        border: 2px solid var(--border-color);
        border-radius: 0;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(100, 150, 255, 0.2);
        color: var(--text-color);
      }

      .tutorial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid var(--border-color);
        background: var(--secondary-bg);
      }

      .step-indicator {
        background: var(--subtle-bg);
        padding: 8px 16px;
        border-radius: 0;
        border: 1px solid var(--border-color);
        font-size: 12px;
        font-weight: bold;
        color: var(--heading-color);
      }

      .current-step {
        color: var(--text-color);
      }

      .tutorial-close {
        background: var(--subtle-bg);
        border: 1px solid var(--border-color);
        color: var(--heading-color);
        font-size: 14px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 0;
        font-family: "Courier New", monospace;
        font-weight: bold;
      }

      .tutorial-close:hover {
        background: rgba(100, 150, 255, 0.2);
        color: var(--text-color);
      }

      .tutorial-body {
        padding: 25px;
        background: var(--secondary-bg);
      }

      .tutorial-title {
        color: var(--title-color);
        margin: 0 0 20px 0;
        font-size: 24px;
        font-weight: bold;
        font-family: "Courier New", monospace;
        text-align: center;
      }

      .tutorial-content h3 {
        color: var(--heading-color);
        margin: 0 0 15px 0;
        font-size: 18px;
        font-family: "Courier New", monospace;
      }

      .tutorial-content h4 {
        color: var(--accent-color);
        margin: 15px 0 10px 0;
        font-size: 14px;
        font-family: "Courier New", monospace;
      }

      .tutorial-content p {
        line-height: 1.6;
        margin: 10px 0;
        color: var(--text-color);
        font-family: "Courier New", monospace;
        font-size: 13px;
      }

      .physics-key, .physics-fact {
        background: var(--subtle-bg);
        border: 1px solid var(--border-color);
        padding: 15px;
        margin: 15px 0;
        border-radius: 0;
      }

      .spin-explanation {
        margin: 20px 0;
      }

      .spin-demo {
        display: flex;
        align-items: center;
        margin: 15px 0;
        padding: 15px;
        background: var(--subtle-bg);
        border: 1px solid var(--border-color);
        border-radius: 0;
      }

      .orb {
        width: 30px;
        height: 30px;
        border-radius: 0;
        margin-right: 20px;
        border: 2px solid var(--text-color);
      }

      .orb-inline {
        width: 16px;
        height: 16px;
        border-radius: 0;
        display: inline-block;
        margin: 0 4px;
        border: 1px solid var(--text-color);
        vertical-align: middle;
      }

      .blue-orb {
        background: #4a90e2;
      }

      .orange-orb {
        background: #ff6b35;
      }

      .spin-label strong {
        color: var(--text-color);
        font-size: 14px;
        font-family: "Courier New", monospace;
      }

      .spin-label small {
        color: rgba(200, 200, 200, 0.8);
        font-family: "Courier New", monospace;
      }

      .controls-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin: 20px 0;
      }

      .control-item {
        background: var(--subtle-bg);
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 0;
      }

      .control-item strong {
        color: var(--heading-color);
        font-family: "Courier New", monospace;
      }

      .keyboard-controls {
        background: var(--subtle-bg);
        padding: 15px;
        border: 1px solid var(--border-color);
        border-radius: 0;
        margin-top: 20px;
      }

      .keyboard-controls h4 {
        margin-top: 0;
      }

      .keyboard-controls p {
        margin: 10px 0 0 0;
        font-family: "Courier New", monospace;
      }

      .tips-list {
        display: grid;
        gap: 10px;
        margin: 20px 0;
      }

      .tip {
        background: var(--subtle-bg);
        padding: 15px;
        border: 1px solid var(--border-color);
        border-radius: 0;
      }

      .tip strong {
        color: var(--heading-color);
        display: block;
        margin-bottom: 8px;
        font-family: "Courier New", monospace;
      }

      .tutorial-footer {
        display: flex;
        justify-content: flex-end;
        padding: 15px 20px;
        border-top: 1px solid var(--border-color);
        background: var(--secondary-bg);
      }

      .tutorial-prev {
        margin-right: auto;
      }

      .tutorial-prev, .tutorial-next {
        background: var(--subtle-bg);
        color: var(--heading-color);
        border: 1px solid var(--border-color);
        padding: 12px 24px;
        border-radius: 0;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        font-family: "Courier New", monospace;
      }

      .tutorial-prev:hover, .tutorial-next:hover {
        background: rgba(100, 150, 255, 0.2);
        color: var(--text-color);
      }

      .tutorial-prev {
        background: var(--primary-bg);
        color: var(--accent-color);
      }

      .tutorial-prev:hover {
        background: rgba(255, 200, 100, 0.1);
      }

      @media (max-width: 600px) {
        .tutorial-modal {
          margin: 20px;
          max-height: 90vh;
        }
        
        .tutorial-body {
          padding: 15px;
        }
        
        .tutorial-header, .tutorial-footer {
          padding: 10px 15px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.overlay);

    // Add click handler to close button
    this.overlay
      .querySelector(".tutorial-close")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.hide();
      });

    // Prevent closing when clicking on modal content
    this.overlay
      .querySelector(".tutorial-modal")
      .addEventListener("click", (e) => {
        e.stopPropagation();
      });
  }

  updateContent() {
    if (!this.overlay) return;

    const step = this.steps[this.currentStep];

    this.overlay.querySelector(".current-step").textContent =
      this.currentStep + 1;
    this.overlay.querySelector(".tutorial-title").textContent = step.title;
    this.overlay.querySelector(".tutorial-text").innerHTML = step.content;

    const prevBtn = this.overlay.querySelector(".tutorial-prev");
    const nextBtn = this.overlay.querySelector(".tutorial-next");

    prevBtn.style.display = this.currentStep > 0 ? "block" : "none";
    nextBtn.textContent = step.buttonText;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.updateContent();
    } else {
      this.hide();
      // Start the game
      if (this.game && this.game.start) {
        this.game.start();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateContent();
    }
  }

  // Check if tutorial should be shown automatically
  shouldShow() {
    return !this.hasBeenShown;
  }

  // Reset tutorial (for testing or if user wants to see it again)
  reset() {
    localStorage.removeItem("atomicTutorialShown");
    this.hasBeenShown = false;
  }
}
