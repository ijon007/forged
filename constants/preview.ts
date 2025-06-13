export const mockPreviewData = {
    "1": {
      id: "1",
      title: "JavaScript Design Patterns",
      description: "A comprehensive guide to modern JavaScript design patterns and best practices.",
      price: 29.99,
      slug: "javascript-design-patterns",
      status: "draft" as const,
      originalContent: `
  # JavaScript Design Patterns - Original PDF Content
  
  ## Table of Contents
  1. Introduction to Design Patterns
  2. Creational Patterns
  3. Structural Patterns
  4. Behavioral Patterns
  
  ## Introduction
  Design patterns are reusable solutions to commonly occurring problems in software design. They represent the best practices used by experienced object-oriented software developers.
  
  ## The Singleton Pattern
  The Singleton pattern ensures a class has only one instance and provides a global point of access to it.
  
  ## The Factory Pattern  
  The Factory Method pattern creates objects without specifying the exact class to create.
  
  ## The Observer Pattern
  The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.
  
  [Additional PDF content would be extracted here...]
      `,
      generatedContent: `
  # JavaScript Design Patterns
  
  *Master the essential patterns that every JavaScript developer should know*
  
  ---
  
  ## Introduction
  
  JavaScript design patterns are reusable solutions to common problems in software design. They represent the best practices used by experienced object-oriented software developers and provide a template for how to solve problems that can be used in many different situations.
  
  In this comprehensive guide, we'll explore the most important design patterns in JavaScript, understand when to use them, and see practical examples that you can apply in your own projects.
  
  ## The Singleton Pattern
  
  The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. This is particularly useful when exactly one object is needed to coordinate actions across the system.
  
  ### When to Use Singleton
  
  - Database connections
  - Logging services  
  - Configuration settings
  - Cache management
  
  ### Implementation
  
  \`\`\`javascript
  class Singleton {
    constructor() {
      if (Singleton.instance) {
        return Singleton.instance;
      }
      
      this.data = [];
      Singleton.instance = this;
      return this;
    }
    
    addData(item) {
      this.data.push(item);
    }
    
    getData() {
      return this.data;
    }
  }
  
  const instance1 = new Singleton();
  const instance2 = new Singleton();
  
  console.log(instance1 === instance2); // true
  \`\`\`
  
  ## The Factory Pattern
  
  The Factory Method pattern creates objects without specifying the exact class to create. Instead of calling a constructor directly, you call a factory method to create the object.
  
  ### Benefits
  
  - **Encapsulation**: The creation logic is encapsulated in one place
  - **Flexibility**: Easy to extend with new types
  - **Loose coupling**: Client code doesn't depend on concrete classes
  
  ### Example
  
  \`\`\`javascript
  class CarFactory {
    static createCar(type) {
      switch(type) {
        case 'sedan':
          return new Sedan();
        case 'suv':
          return new SUV();
        case 'hatchback':
          return new Hatchback();
        default:
          throw new Error('Unknown car type');
      }
    }
  }
  
  const myCar = CarFactory.createCar('sedan');
  \`\`\`
  
  ## The Observer Pattern
  
  The Observer pattern defines a one-to-many dependency between objects. When one object changes state, all its dependents are notified and updated automatically.
  
  This pattern is the foundation of the Model-View architecture and is extensively used in event-driven programming.
  
  ### Real-world Applications
  
  - Event listeners in the DOM
  - Model-View architectures (MVC, MVP, MVVM)
  - Redux state management
  - React component re-rendering
  
  ### Implementation
  
  \`\`\`javascript
  class Subject {
    constructor() {
      this.observers = [];
    }
    
    subscribe(observer) {
      this.observers.push(observer);
    }
    
    unsubscribe(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
      this.observers.forEach(observer => observer.update(data));
    }
  }
  
  class Observer {
    constructor(name) {
      this.name = name;
    }
    
    update(data) {
      console.log(\`\${this.name} received: \${data}\`);
    }
  }
  
  const subject = new Subject();
  const observer1 = new Observer('Observer 1');
  const observer2 = new Observer('Observer 2');
  
  subject.subscribe(observer1);
  subject.subscribe(observer2);
  subject.notify('Hello World!');
  \`\`\`
  
  ## Conclusion
  
  Understanding and implementing design patterns in JavaScript will make your code more maintainable, scalable, and easier to understand. These patterns provide proven solutions to common problems and help establish a common vocabulary among developers.
  
  Remember, patterns are tools - use them when they solve a real problem, not just because they exist.
      `
    }
  }