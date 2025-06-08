// flashcards.js - Flashcards feature for Quiz Master using AngularJS

// Create flashcards module
angular.module('quizMasterFlashcards', [])
  .controller('FlashcardsController', ['$scope', function($scope) {
    // Get current username (fallback if not defined)
    const username = (typeof currentUser !== 'undefined' && currentUser.username) ? currentUser.username : 'guest';

    // Initialize flashcards data
    $scope.flashcards = JSON.parse(localStorage.getItem(`flashcards_${username}`)) || [];
    $scope.currentCardIndex = 0;
    $scope.showAnswer = false;
    $scope.editMode = false;
    $scope.newCard = { question: '', answer: '', category: 'General' };
    $scope.currentCategory = 'All';

    // Sample categories for selection
    $scope.CATEGORIES = ['General', 'Science', 'Math', 'History', 'Programming'];

    // Navigation functions
    $scope.nextCard = function () {
      if ($scope.currentCardIndex < $scope.getFilteredFlashcards().length - 1) {
        $scope.currentCardIndex++;
        $scope.showAnswer = false;
      }
    };

    $scope.prevCard = function () {
      if ($scope.currentCardIndex > 0) {
        $scope.currentCardIndex--;
        $scope.showAnswer = false;
      }
    };

    // Card control functions
    $scope.toggleAnswer = function () {
      $scope.showAnswer = !$scope.showAnswer;
    };

    $scope.addCard = function () {
      if ($scope.newCard.question && $scope.newCard.answer) {
        $scope.flashcards.push({
          question: $scope.newCard.question,
          answer: $scope.newCard.answer,
          category: $scope.newCard.category
        });
        $scope.newCard = { question: '', answer: '', category: 'General' };
        $scope.saveFlashcards();
      }
    };

    $scope.deleteCard = function (index) {
      const filtered = $scope.getFilteredFlashcards();
      const realIndex = $scope.flashcards.indexOf(filtered[index]);
      if (realIndex !== -1) {
        $scope.flashcards.splice(realIndex, 1);
        $scope.currentCardIndex = Math.min($scope.currentCardIndex, $scope.getFilteredFlashcards().length - 1);
        $scope.saveFlashcards();
      }
    };

    $scope.saveFlashcards = function () {
      localStorage.setItem(`flashcards_${username}`, JSON.stringify($scope.flashcards));
    };

    $scope.getCategories = function () {
      const categories = new Set($scope.flashcards.map(card => card.category));
      return Array.from(categories);
    };

    $scope.filterByCategory = function (category) {
      $scope.currentCategory = category;
      $scope.currentCardIndex = 0;
    };

    $scope.getFilteredFlashcards = function () {
      if ($scope.currentCategory === 'All') return $scope.flashcards;
      return $scope.flashcards.filter(card => card.category === $scope.currentCategory);
    };
  }]);

// Render flashcards page and initialize AngularJS
function renderFlashcardsPage() {
  pageContainer.innerHTML = `
    <div class="page" ng-controller="FlashcardsController">
      <div class="flashcards-container">
        <h2>Flashcards</h2>
        
        <div class="flashcard-controls" ng-if="getFilteredFlashcards().length > 0">
          <button ng-click="prevCard()" ng-disabled="currentCardIndex <= 0">
            <i class="fas fa-arrow-left"></i> Previous
          </button>
          <span>{{currentCardIndex + 1}} / {{getFilteredFlashcards().length}}</span>
          <button ng-click="nextCard()" ng-disabled="currentCardIndex >= getFilteredFlashcards().length - 1">
            Next <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="flashcard" ng-if="getFilteredFlashcards().length > 0">
          <div class="flashcard-question" ng-click="toggleAnswer()">
            {{getFilteredFlashcards()[currentCardIndex].question}}
          </div>
          <div class="flashcard-answer" ng-show="showAnswer">
            {{getFilteredFlashcards()[currentCardIndex].answer}}
          </div>
          <div class="flashcard-category">
            Category: {{getFilteredFlashcards()[currentCardIndex].category}}
          </div>
        </div>
        
        <div class="no-cards" ng-if="getFilteredFlashcards().length === 0">
          <p>No flashcards available for this category. Add some below!</p>
        </div>
        
        <div class="flashcard-actions">
          <button ng-click="editMode = !editMode">
            {{editMode ? 'Close Editor' : 'Add/Edit Cards'}}
          </button>
          
          <div class="category-filter">
            <label>Filter by category:</label>
            <select ng-model="currentCategory" ng-change="filterByCategory(currentCategory)">
              <option value="All">All</option>
              <option ng-repeat="cat in getCategories()" value="{{cat}}">{{cat}}</option>
            </select>
          </div>
        </div>
        
        <div class="flashcard-editor" ng-show="editMode">
          <h3>Add New Flashcard</h3>
          <div class="editor-form">
            <input type="text" ng-model="newCard.question" placeholder="Question">
            <textarea ng-model="newCard.answer" placeholder="Answer"></textarea>
            <select ng-model="newCard.category">
              <option ng-repeat="cat in CATEGORIES" value="{{cat}}">{{cat}}</option>
            </select>
            <button ng-click="addCard()">Add Card</button>
          </div>
          
          <div class="card-list" ng-if="flashcards.length > 0">
            <h3>Your Flashcards</h3>
            <div class="card-item" ng-repeat="(i, card) in getFilteredFlashcards() track by $index">
              <div class="card-question">{{card.question}}</div>
              <div class="card-answer">{{card.answer}}</div>
              <div class="card-category">{{card.category}}</div>
              <button ng-click="deleteCard(i)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .flashcards-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .flashcard-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0;
      }
      .flashcard {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #f9f9f9;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        cursor: pointer;
      }
      .flashcard-question {
        font-size: 1.2em;
        margin-bottom: 15px;
      }
      .flashcard-answer {
        font-size: 1em;
        color: #555;
        border-top: 1px solid #eee;
        padding-top: 15px;
        margin-top: 15px;
        width: 100%;
      }
      .flashcard-category {
        margin-top: 15px;
        font-size: 0.8em;
        color: #888;
      }
      .flashcard-actions {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
      }
      .editor-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
      }
      .editor-form input, 
      .editor-form textarea,
      .editor-form select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .editor-form textarea {
        min-height: 100px;
      }
      .card-list {
        margin-top: 20px;
      }
      .card-item {
        border: 1px solid #eee;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: #f5f5f5;
      }
      .card-question {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .card-answer {
        color: #555;
        margin-bottom: 5px;
      }
      .card-category {
        font-size: 0.8em;
        color: #888;
        margin-bottom: 10px;
      }
    </style>
  `;

  // Manual AngularJS bootstrap if needed
  if (!angular.element(document).injector()) {
    angular.bootstrap(document, ['quizMasterFlashcards']);
  }
}
